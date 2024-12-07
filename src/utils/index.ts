import { ethers } from "ethers";

export const toWei = (num: number) => ethers.parseEther(num.toString());
export const fromWei = (num: number) => ethers.formatEther(num);

export const formatDate = (timestamp: number) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(timestamp);
  // @ts-expect-error date
  return date.toLocaleDateString("en-US", options);
};

export const truncate = (
  text: string,
  startChars: number,
  endChars: number,
  maxLength: number
) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};
