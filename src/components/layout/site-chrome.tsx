"use client";

import { usePathname } from "next/navigation";

function isPrivateReviewPath(pathname: string) {
  return pathname.split("/").includes("review");
}

/**
 * Hide the public site chrome inside the private review workspace.
 *
 * The owner dashboard is not part of the site a visitor browses: the marketing
 * header, footer and mobile bottom nav are dead weight there, and they push the
 * dashboard's own navigation below a screenful of links to public pages. Same
 * path test as `TrackingBoundary`, which already carves out the same routes.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isPrivateReviewPath(pathname)) return null;
  return <>{children}</>;
}
