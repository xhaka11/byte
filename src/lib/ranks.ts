import rank3Svg from "@/assets/ranks/3.svg";
import rank4Svg from "@/assets/ranks/4.svg";
import rank5Svg from "@/assets/ranks/5.svg";
import rank6Svg from "@/assets/ranks/6.svg";
import rank7Svg from "@/assets/ranks/7.svg";
import rank8Svg from "@/assets/ranks/8.svg";
import rank9Svg from "@/assets/ranks/9.svg";
import rank10Svg from "@/assets/ranks/10.svg";
import rank11Svg from "@/assets/ranks/11.svg";
import rank12Svg from "@/assets/ranks/12.svg";
import rank13Svg from "@/assets/ranks/13.svg";
import rank14Svg from "@/assets/ranks/14.svg";
import rank15Svg from "@/assets/ranks/15.svg";
import rank16Svg from "@/assets/ranks/16.svg";
import rank17Svg from "@/assets/ranks/17.svg";
import rank18Svg from "@/assets/ranks/18.svg";

export const RANK_ICONS: Record<number, string> = {
  3: rank3Svg,
  4: rank4Svg,
  5: rank5Svg,
  6: rank6Svg,
  7: rank7Svg,
  8: rank8Svg,
  9: rank9Svg,
  10: rank10Svg,
  11: rank11Svg,
  12: rank12Svg,
  13: rank13Svg,
  14: rank14Svg,
  15: rank15Svg,
  16: rank16Svg,
  17: rank17Svg,
  18: rank18Svg,
};

export function getRankIcon(tierId: number): string {
  return RANK_ICONS[tierId] ?? rank18Svg;
}
