const getTextPrompt = (
  generalTextPrompt
) => `Generate a JSON-formatted comic strip script from the ALL CAPS "GeneralPrompt" shown below. The comic strip should have three (3) panels. The response should be JSON data in the provided example format. The response should include panel number, scene description, and character dialogues, as well as detailed scene information such as background elements, props, and character positions.
Response Format Schema:
{
  "title": (string),
  "description": (string),
  "structure": {
    "panels": [
      {
        "number": (integer),
        "scene": (string),
        "sceneDetails": {
          "background": (string),
          "props": (array of strings),
          "characterPositions": (array of objects)
        },
        "characters": [
          {
            "name": (string),
            "dialogue": (string)
          }
        ]
      }
    ]
  }
}

Here is the "general" prompt which provides description of the contents of the comic strip:

"GeneralPrompt": ${generalTextPrompt.toUpperCase()}

Please return only JSON data and no plain text`;

const getImagePrompt = (sceneDescription, sceneDetails) =>
  `Create an animated cartoon picture based on the following scene and details:
  SCENE: "${sceneDescription}
  SCENE_DETAILS: "${sceneDetails}"`;

module.exports = { getTextPrompt, getImagePrompt };
