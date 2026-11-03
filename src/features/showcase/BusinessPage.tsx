import { buildPageViewModel, PageRenderer } from "@/features/page/renderer";
import { initialConfig, toContent, toPage } from "./lab-state";
/** Curated public pages use the same content, style and blocks as Studio. Contact links go to the existing businesses. */
export function BusinessPage({scenario}:{scenario:"fixnow"|"brightlearn"}) {
  const config=initialConfig(scenario);
  const vm=buildPageViewModel(toContent(config),toPage(config),{plan:"business"});
  return <PageRenderer vm={{...vm,showBranding:true}} />;
}
