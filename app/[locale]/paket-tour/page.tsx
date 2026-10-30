/**
 * Legacy tour package listing URL.
 * Tour packages are now the homepage, so keep shared links working with a
 * permanent redirect. Detail URLs remain at /[locale]/paket-tour/[slug].
 */

import { permanentRedirect } from 'next/navigation';

export default async function PaketTourPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}#paket-tour`);
}
