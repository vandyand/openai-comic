require("dotenv").config();
const path = require("path");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { getTextPrompt, getImagePrompt } = require("./helpers/prompt");
const generateComicHTML = require("./components/generate-comic-html");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const generateText = async (
  prompt,
  model = "gpt-3.5-turbo",
  temperature = 0.7
) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating text:", error);
    return null;
  }
};

const generateImage = async (prompt, n = 2, size = "1024x1024") => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt,
        n,
        size,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  const generatedText = await generateText(getTextPrompt(req.body.prompt));

  try {
    const cleanJSON = generatedText.replace(/,\s*([\]}])/g, "$1");
    const comicData = JSON.parse(cleanJSON);

    // Generate an array of promises for image generation
    const imageGenerationPromises = comicData.structure.panels.map(
      (panel, index) => {
        const sceneDescription = panel.scene;
        const sceneDetails = panel.sceneDetails;

        // Pass the sceneDetails object along with the sceneDescription and panel index
        return generateImage(
          getImagePrompt(sceneDescription, sceneDetails),
          index + 1
        );
      }
    );

    // Wait for all image generation promises to resolve
    const generatedImages = await Promise.all(imageGenerationPromises);

    // Add the generated images to the comicData
    for (let i = 0; i < comicData.structure.panels.length; i++) {
      comicData.structure.panels[i].imageData = generatedImages[i];
    }

    console.log("comicData:", comicData);

    const html = generateComicHTML(comicData);
    res.send(html);
  } catch (error) {
    console.error("Error generating comic:", error);
    res.status(500).send("Error generating comic");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
