import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueFilmSimulations } from '@/photo/db/query';
import { FilmSimulation, generateMetaForFilmSimulation } from '@/film';
import FilmOverview from '@/film/FilmOverview';
import { getPhotosFilmSimulationDataCached } from '@/film/data';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { PATH_ROOT } from '@/app/paths';
import { redirect } from 'next/navigation';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';

const getPhotosFilmSimulationDataCachedCached =
  cache(getPhotosFilmSimulationDataCached);

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'films',
  'page',
  getUniqueFilmSimulations,
  films => films.map(({ film }) => ({ film })),
);

interface FilmSimulationProps {
  params: Promise<{ film: FilmSimulation }>
}

export async function generateMetadata({
  params,
}: FilmSimulationProps): Promise<Metadata> {
  const { film } = await params;

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFilmSimulationDataCachedCached({
    simulation: film,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  });

  if (photos.length === 0) { return {}; }

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForFilmSimulation(film, photos, count, dateRange);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function FilmPage({
  params,
}: FilmSimulationProps) {
  const { film } = await params;

  const [
    photos,
    { count, dateRange },
  ] =  await getPhotosFilmSimulationDataCachedCached({
    simulation: film,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  });

  if (photos.length === 0) { redirect(PATH_ROOT); } 

  return (
    <FilmOverview {...{
      simulation: film,
      photos,
      count,
      dateRange,
    }} />
  );
}
