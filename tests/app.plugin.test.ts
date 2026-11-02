import type {AndroidManifest, ExportedConfig} from '@expo/config-plugins';
import withMapLink from '../app.plugin';

const applyManifest = async (
  manifest: Partial<AndroidManifest['manifest']>,
) => {
  const config = withMapLink({name: 'test', slug: 'test'}) as ExportedConfig;
  const mod = config.mods?.android?.manifest;
  if (!mod) {
    throw new Error('Android manifest mod was not registered');
  }
  const result = await mod({
    ...config,
    modRawConfig: config,
    modRequest: {
      projectRoot: __dirname,
      platformProjectRoot: __dirname,
      platform: 'android',
      modName: 'manifest',
      introspect: true,
    },
    // Intentionally incomplete to exercise initialization of missing queries.
    modResults: {manifest: manifest as AndroidManifest['manifest']},
  });
  return result.modResults.manifest;
};

describe('Android Neshan package visibility', () => {
  const packageName = 'org.rajman.neshan.traffic.tehran.navigator';

  it('initializes queries and preserves existing map intents', async () => {
    const manifest = await applyManifest({});
    expect(manifest.queries[0].package).toEqual([
      {$: {'android:name': packageName}},
    ]);
    expect(
      manifest.queries[0].intent?.map((intent) => intent.data?.[0].$),
    ).toEqual([{'android:scheme': 'geo'}, {'android:scheme': 'waze'}]);
  });

  it('preserves other queries and does not duplicate the package on rerun', async () => {
    const existingPackage = {$: {'android:name': 'com.example.other'}};
    const manifest = await applyManifest({
      queries: [{package: [existingPackage]}],
    });
    const repeated = await applyManifest(manifest);
    expect(repeated.queries[0].package).toEqual([
      existingPackage,
      {$: {'android:name': packageName}},
    ]);
    expect(repeated.queries[0].intent).toHaveLength(2);
  });

  it('recognizes a package declaration in another queries element', async () => {
    const manifest = await applyManifest({
      queries: [{package: []}, {package: [{$: {'android:name': packageName}}]}],
    });
    expect(manifest.queries[0].package).toEqual([]);
  });

  it('does not add an unverified iOS Neshan scheme', async () => {
    const config = withMapLink({name: 'test', slug: 'test'}) as ExportedConfig;
    const mod = config.mods?.ios?.infoPlist;
    if (!mod) {
      throw new Error('iOS plist mod was not registered');
    }
    const result = await mod({
      ...config,
      modRawConfig: config,
      modRequest: {
        projectRoot: __dirname,
        platformProjectRoot: __dirname,
        platform: 'ios',
        modName: 'infoPlist',
        introspect: true,
      },
      modResults: {},
    });
    expect(result.modResults.LSApplicationQueriesSchemes).not.toContain('nshn');
    expect(result.modResults.LSApplicationQueriesSchemes).not.toContain(
      'neshan',
    );
  });
});
