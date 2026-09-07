import type { Metadata } from "next";

import MomentsUpload from "./MomentsUpload";

export const metadata: Metadata = {
  title:
    "Compartilhe um momento | Gabriel & Luana",
  description:
    "Compartilhe uma foto e uma mensagem para o mural de momentos do casamento de Gabriel e Luana.",
};

export default function MomentsPage() {
  return <MomentsUpload />;
}