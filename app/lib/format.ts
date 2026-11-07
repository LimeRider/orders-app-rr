import { mm2ToM2Rounded } from "./calculator";

const nf = (n: number) =>
  n.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatMoney = (kop: number) => `${nf(kop / 100)} грн`;

export const formatArea = (mm2: number) => `${nf(mm2ToM2Rounded(mm2))} м²`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("uk-UA", { timeZone: "Europe/Kyiv" });

export const STATUS_LABELS = {
  new: "Нове",
  in_progress: "В роботі",
  done: "Виконано",
};
