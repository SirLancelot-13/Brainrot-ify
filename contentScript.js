const tagsToIgnore = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'CANVAS']);

function isVisible(element) {
  if (!element || element.nodeType === Node.TEXT_NODE) return true;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function getAllTextContent(element, list = []) {
  if (element.nodeType === Node.ELEMENT_NODE && !isVisible(element)) return list;

  if (element.nodeType === Node.TEXT_NODE) {
    const text = element.textContent.trim();
    list.push(element);
  } else if (element.nodeType === Node.ELEMENT_NODE && !tagsToIgnore.has(element.tagName)) {
    for (const child of element.childNodes) {
      getAllTextContent(child, list);
    }
  }
  return list;
}

async function replaceContentWithBrainrot(nodes) {
  console.log(`Targeting ${Math.min(nodes.length, 25)} meaty text nodes...`);
  for (const node of nodes.slice(0, 25)) {
    try {
      const brainrot = await chrome.runtime.sendMessage({
        type: "BRAINROT",
        prompt: "Convert this text to Brainrot. Make it humorous and have an instagram sense of humor. If the text content is only a name or can't be changed into brainrotted text, dont change it: " + node.textContent
      });

      if (brainrot) {
        console.log("Applied brainrot to a node.");
        node.textContent = brainrot;
      }
    } catch (err) {
      console.log("Something went skibidi:", err);
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "START_BRAINROT") {
    console.log("Melt sequence initiated...");
    const textNodes = getAllTextContent(document.body);
    console.log(`${textNodes.length} text nodes.`);
    replaceContentWithBrainrot(textNodes);
    sendResponse({ status: "success", count: textNodes.length });
  }
  return true;
});
