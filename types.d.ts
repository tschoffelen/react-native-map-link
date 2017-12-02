enum MapsApp {
    'apple-maps',
    'google-maps',
    'citymapper',
    'uber',
    'lyft',
    'navigon',
    'transit',
    'waze',
    'yandex',
    'moovit'
}

export type OpenMapsOptions = {
    latitude: number | string;
    longitude: number | string;
    title: string | undefined | null;
    app: MapsApp | undefined | null;
}
