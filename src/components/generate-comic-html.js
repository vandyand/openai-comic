function generateComicHTML(comicData) {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${comicData.title}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-white antialiased">
      <div class="container mx-auto px-4 py-5">
        <h1 class="text-4xl font-bold mb-4">${comicData.title}</h1>
        <p class="mb-5">${comicData.description}</p>
        <div class="panels-container flex flex-wrap justify-center gap-4">
  `;

  for (const panel of comicData.structure.panels) {
    const imageUrl =
      panel.imageData && panel.imageData[0] && panel.imageData[0].url
        ? panel.imageData[0].url
        : "";
    html += `<div class="panel flex flex-col items-center space-y-2">`;
    html += `<h2 class="text-xl font-semibold">Panel ${panel.number}</h2>`;
    if (imageUrl) {
      html += `<img src="${imageUrl}" alt="Panel ${panel.number}" class="w-64 h-auto">`;
    }
    html += `<div class="caption text-center w-64">`;
    for (const character of panel.characters) {
      html += `<p><strong>${character.name}:</strong> ${character.dialogue}</p>`;
    }
    html += `</div></div>`;
  }

  html += `</div></div></body></html>`;

  return html;
}

module.exports = generateComicHTML;
