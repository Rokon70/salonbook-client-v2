/**
 * Curated visual layer for the storefront only.
 *
 * The image/video pairs below are tasteful salon editorial shots from Mixkit's
 * free video library. They are keyed by the seeded service ids and names so the
 * admin dashboard keeps showing whatever image is actually stored in MongoDB.
 * Remove a key (or this whole helper) to fall back to the database image.
 */

const VIDEO = (id) => `https://assets.mixkit.co/videos/${id}/${id}-360.mp4`;
const IMAGE = (name) => `/lookbook/${name}.jpg`;

const BY_ID = {
  "6afe18c4021ee1d6842af219": { image: IMAGE("hydrating-facial"), video: VIDEO("49258") },
  "6afe18c4021ee1d6842af217": { image: IMAGE("balayage-hair"), video: VIDEO("16979") },
  "6afe18c4021ee1d6842af218": { image: IMAGE("deep-repair"), video: VIDEO("16044") },
  "6afe18c4021ee1d6842af216": { image: IMAGE("signature-haircut"), video: VIDEO("49556") },
  "6afe18c4021ee1d6842af21a": { image: IMAGE("bridal-makeup"), video: VIDEO("40592") },
  "6afe18c4021ee1d6842af21b": { image: IMAGE("gel-manicure"), video: VIDEO("23596") },
  "6afe18c4021ee1d6842af21c": { image: IMAGE("spa-pedicure"), video: VIDEO("27906") },
  "6afe18c4021ee1d6842af21d": { image: IMAGE("aromatherapy-massage"), video: VIDEO("14781") },
};

const BY_NAME = {
  "hydrating facial": BY_ID["6afe18c4021ee1d6842af219"],
  "balayage hair coloring": BY_ID["6afe18c4021ee1d6842af217"],
  "deep repair hair treatment": BY_ID["6afe18c4021ee1d6842af218"],
  "signature haircut & blow-dry": BY_ID["6afe18c4021ee1d6842af216"],
  "bridal makeup": BY_ID["6afe18c4021ee1d6842af21a"],
  "gel manicure": BY_ID["6afe18c4021ee1d6842af21b"],
  "spa pedicure": BY_ID["6afe18c4021ee1d6842af21c"],
  "aromatherapy massage": BY_ID["6afe18c4021ee1d6842af21d"],
};

/** Returns the display image plus an optional motion preview for a service. */
export function resolveMedia(service = {}) {
  const curated = BY_ID[service._id] || BY_NAME[String(service.serviceName || "").toLowerCase().trim()];
  return {
    image: curated?.image || service.image || "",
    video: curated?.video || "",
    curated: Boolean(curated),
  };
}
