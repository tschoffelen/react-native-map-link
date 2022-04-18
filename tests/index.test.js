import {showLocation} from '../src/index';
import {Linking} from 'react-native';

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('showLocation', () => {
  const latitude = 123;
  const longitude = 234;
  const sourceLatitude = 567;
  const sourceLongitude = 890;

  beforeEach(() => {
    Linking.openURL.mockClear();
  });

  const verifyThatSettingsLeadToUrl = (settings, url) => {
    showLocation(settings);
    expect(Linking.openURL).toHaveBeenCalledWith(url);
  };

  describe('dgis', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'dgis',
        },
        'dgis://2gis.ru/routeSearch/to/234,123/go',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'dgis',
        },
        'dgis://2gis.ru/routeSearch/to/234,123/from/890,567/go',
      );
    });
  });

  describe('apple-maps', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'apple-maps',
        },
        'maps://?sll=123,234&q=Location',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'apple-maps',
        },
        'maps://?saddr=567,890&daddr=123,234&q=Location',
      );
    });
  });

  describe('google-maps', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'google-maps',
        },
        'https://www.google.com/maps/search/?api=1&query=123,234',
      );
    });

    it('opens with correct url if source is not provided, and has title', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude: undefined,
          longitude: undefined,
          title: 'Taco Bell',
          app: 'google-maps',
        },
        'https://www.google.com/maps/search/?api=1&query=Taco%20Bell',
      );
    });

    it('opens with correct url if source is not provided, and has place id', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          googlePlaceId: 'ChIJ10bTGLWxEmsRFX2VrdMRW_A',
          app: 'google-maps',
        },
        'https://www.google.com/maps/search/?api=1&query=123,234&query_place_id=ChIJ10bTGLWxEmsRFX2VrdMRW_A',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'google-maps',
        },
        'https://www.google.com/maps/dir/?api=1&origin=567,890&destination=123,234',
      );
    });
  });

  describe('citymapper', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'citymapper',
        },
        'citymapper://directions?endcoord=123,234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'citymapper',
        },
        'citymapper://directions?endcoord=123,234&startcoord=567,890',
      );
    });
  });

  describe('uber', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'uber',
        },
        'uber://?action=setPickup&dropoff[latitude]=123&dropoff[longitude]=234&pickup=my_location',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'uber',
        },
        'uber://?action=setPickup&dropoff[latitude]=123&dropoff[longitude]=234&pickup[latitude]=567&pickup[longitude]=890',
      );
    });
  });

  describe('lyft', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'lyft',
        },
        'lyft://ridetype?id=lyft&destination[latitude]=123&destination[longitude]=234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'lyft',
        },
        'lyft://ridetype?id=lyft&destination[latitude]=123&destination[longitude]=234&pickup[latitude]=567&pickup[longitude]=890',
      );
    });
  });

  describe('transit', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'transit',
        },
        'transit://directions?to=123,234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'transit',
        },
        'transit://directions?to=123,234&from=567,890',
      );
    });
  });

  describe('truckmap', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'truckmap',
        },
        'https://truckmap.com/place/123,234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'truckmap',
        },
        'https://truckmap.com/route/567,890/123,234',
      );
    });
  });

  describe('waze', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'waze',
        },
        'waze://?ll=123,234&navigate=yes',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'waze',
        },
        'waze://?ll=123,234&navigate=yes',
      );
    });
  });

  describe('yandex', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'yandex',
        },
        'yandexnavi://build_route_on_map?lat_to=123&lon_to=234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'yandex',
        },
        'yandexnavi://build_route_on_map?lat_to=123&lon_to=234&lat_from=567&lon_from=890',
      );
    });
  });

  describe('moovit', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'moovit',
        },
        'moovit://directions?dest_lat=123&dest_lon=234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'moovit',
        },
        'moovit://directions?dest_lat=123&dest_lon=234&orig_lat=567&orig_lon=890',
      );
    });
  });

  describe('yandex-taxi', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'yandex-taxi',
        },
        'yandextaxi://route?end-lat=123&end-lon=234&appmetrica_tracking_id=1178268795219780156',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'yandex-taxi',
        },
        'yandextaxi://route?end-lat=123&end-lon=234&appmetrica_tracking_id=1178268795219780156',
      );
    });
  });

  describe('yandex-maps', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'yandex-maps',
        },
        'yandexmaps://maps.yandex.ru/?pt=234,123',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'yandex-maps',
        },
        'yandexmaps://maps.yandex.ru/?pt=234,123',
      );
    });
  });

  describe('kakaomap', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'kakaomap',
        },
        'kakaomap://look?p=123,234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'kakaomap',
        },
        'kakaomap://route?sp=567,890&ep=123,234&by=CAR',
      );
    });
  });

  describe('mapycz', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'mapycz',
        },
        'szn-mapy://www.mapy.cz/zakladni?x=234&y=123&source=coor&id=234,123',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'mapycz',
        },
        'szn-mapy://www.mapy.cz/zakladni?x=234&y=123&source=coor&id=234,123',
      );
    });
  });
  describe('maps-me', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'maps-me',
        },
        'mapsme://route?sll=undefined,undefined&saddr= &dll=123,234&daddr=null&type=vehicle',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'maps-me',
        },
        'mapsme://route?sll=567,890&saddr= &dll=123,234&daddr=null&type=vehicle',
      );
    });
  });
  describe('osmand', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'osmand',
        },
        'osmandmaps://?lat=123&lon=234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'osmand',
        },
        'osmandmaps://?lat=123&lon=234',
      );
    });
  });
  describe('gett', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'gett',
        },
        'gett://order?pickup=my_location&dropoff_latitude=123&dropoff_longitude=234',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'gett',
        },
        'gett://order?pickup=my_location&dropoff_latitude=123&dropoff_longitude=234',
      );
    });
  });
  describe('navermap', () => {
    it('opens with correct url if source is not provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          app: 'navermap',
          naverCallerName: 'NaverName',
        },
        'nmap://map?lat=123&lng=234&appname=NaverName',
      );
    });

    it('opens with correct url if source is provided', () => {
      verifyThatSettingsLeadToUrl(
        {
          latitude,
          longitude,
          sourceLatitude,
          sourceLongitude,
          app: 'navermap',
          naverCallerName: 'NaverName',
        },
        'nmap://route?slat=567&slng=890&dlat=123&dlng=234&appname=NaverName',
      );
    });
  });
});
