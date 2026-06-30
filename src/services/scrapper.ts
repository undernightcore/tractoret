import { JSDOM } from "jsdom";

export const getUrlData = async (url: string) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const content = await response.text();
  const dom = new JSDOM(content);

  return { title: dom.window.document.title, content };
};

export const getLinkData = (content: string, stock: string, price: string) => {
  const dom = new JSDOM(content);
  return {
    stock: content.includes(stock),
    price: dom.window.document.querySelector(price)?.textContent,
  };
};
