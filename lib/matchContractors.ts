import { getDistanceMiles } from "./distance";

type Contractor = {
  id: string;
  phone: string;
  zip_code?: string;
  rating: number;
  jobs_completed: number;
  last_active: string;
  is_available: boolean;
  lat?: number;
  lng?: number;
};

function recencyScore(lastActive: string) {
  if (!lastActive) return 5;

  const diffHours =
    (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) return 10;
  if (diffHours < 6) return 7;
  if (diffHours < 24) return 4;
  return 1;
}

function geoScore(jobLat: number, jobLng: number, cLat?: number, cLng?: number) {
  if (!cLat || !cLng) return 0;

  const miles = getDistanceMiles(jobLat, jobLng, cLat, cLng);

  if (miles < 2) return 50;
  if (miles < 5) return 35;
  if (miles < 10) return 20;
  if (miles < 25) return 10;
  return 0;
}

export function rankContractors(
  jobLat: number,
  jobLng: number,
  contractors: Contractor[]
) {
  return contractors
    .map((c) => {
      const score =
        geoScore(jobLat, jobLng, c.lat, c.lng) +
        c.rating * 6 +
        (c.is_available ? 10 : 0) +
        recencyScore(c.last_active);

      return { ...c, score };
    })
    .sort((a, b) => b.score - a.score);
}