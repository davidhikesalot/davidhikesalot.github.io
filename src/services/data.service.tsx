import { Hikes } from "./hikes.service";
import { Parks } from "./parks.service";

export interface IGoogleSheetRow {
  [key: string]: string;
}

export interface ISiteData {
  parks?: Parks;
  hikes?: Hikes;
}

export function fetchSiteData(): Promise<ISiteData> {
  const urls = [
    "https://script.google.com/macros/s/AKfycbwzfA7hwgguH3TAu2_QWMPncVNho3VNpJfyimwIlQIJE7dngm6JLYxCWHnFzDMbJWnBiA/exec?sheet=parks",
    "https://script.google.com/macros/s/AKfycbwzfA7hwgguH3TAu2_QWMPncVNho3VNpJfyimwIlQIJE7dngm6JLYxCWHnFzDMbJWnBiA/exec?sheet=hikes",
  ];
  return Promise.all(urls.map((url) => fetch(url)))
    .then((responses) => {
      const failedFetches = responses.filter((r) => !r.ok);
      if (failedFetches.length) {
        throw Error(failedFetches.map((r) => r.statusText).join(","));
      }
      return Promise.all(responses.map((r) => r.json()));
    })
    .then((rjsons) => {
      const parks: Parks = Parks.build(rjsons[0]);
      const hikes: Hikes = Hikes.build(rjsons[1], parks);
      parks.updatePlans();

      return { parks, hikes };
    });
}
