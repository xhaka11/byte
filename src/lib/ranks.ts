import rank3Webp from "@/assets/ranks/3.webp";
import rank4Webp from "@/assets/ranks/4.webp";
import rank5Webp from "@/assets/ranks/5.webp";
import rank6Webp from "@/assets/ranks/6.webp";
import rank7Webp from "@/assets/ranks/7.webp";
import rank8Webp from "@/assets/ranks/8.webp";
import rank9Webp from "@/assets/ranks/9.webp";
import rank10Webp from "@/assets/ranks/10.webp";
import rank11Webp from "@/assets/ranks/11.webp";
import rank12Webp from "@/assets/ranks/12.webp";
import rank13Webp from "@/assets/ranks/13.webp";
import rank14Webp from "@/assets/ranks/14.webp";
import rank15Webp from "@/assets/ranks/15.webp";
import rank16Webp from "@/assets/ranks/16.webp";
import rank17Webp from "@/assets/ranks/17.webp";
import rank18Webp from "@/assets/ranks/18.webp";

export const RANK_ICONS: Record<number, string> = {
  3: rank3Webp,
  4: rank4Webp,
  5: rank5Webp,
  6: rank3Webp,
  7: rank4Webp,
  8: rank5Webp,
  9: rank6Webp,
  10: rank7Webp,
  11: rank8Webp,
  12: rank9Webp,
  13: rank10Webp,
  14: rank11Webp,
  15: rank12Webp,
  16: rank13Webp,
  17: rank14Webp,
  18: rank15Webp,
};

export function getRankIcon(tierId: number): string {
  return RANK_ICONS[tierId] ?? rank18Webp;
}
