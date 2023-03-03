import {useRef, useMemo, useState, useEffect} from "react";
import {View, ViewProps} from "react-native";
import Constants from "expo-constants";
import useSupercluster from "use-supercluster";
import Supercluster from "supercluster";
import {BBox, GeoJsonProperties} from "geojson";
import MapboxGL from "@rnmapbox/maps";
import {trpc} from "@/lib/trpc";
import ClusterMarker from "./ClusterMarker";
import IndividualMarker from "./IndividualMarker";
import {useListen, useSubscription} from "@/features/ws";

interface MapProps extends ViewProps {
  clanId: number;
  neBound: number[];
  swBound: number[];
  finalPadding: number;
}

const Map: React.FC<MapProps> = ({
  clanId,
  neBound,
  swBound,
  finalPadding,
  ...props
}) => {
  const MAX_ZOOM = 18;

  const utils = trpc.useContext();
  const map = useRef<MapboxGL.MapView>(null);

  const {data, isLoading, isError} = trpc.clan.getLastLocations.useQuery({
    clanId,
  });

  const [ne, setNe] = useState(neBound);
  const [sw, setSw] = useState(swBound);
  const [padding, setPadding] = useState(0);

  // Current zoom value
  const [zoom, setZoom] = useState(15);

  // Current bounds
  const [bounds, setBounds] = useState<BBox>([...swBound, ...neBound] as BBox);

  // Points to show
  const points = useMemo<Array<Supercluster.PointFeature<GeoJsonProperties>>>(
    () =>
      (data ?? [])
        .filter(
          (member) =>
            member.lastPosition.longitude && member.lastPosition.latitude
        )
        .map((member) => {
          return {
            type: "Feature",
            properties: {
              cluster: false,
              avatarUrl: member.avatarUrl,
              nickname: member.nickname,
              when: member.lastPosition.when,
            },
            geometry: {
              type: "Point",
              coordinates: [
                member.lastPosition.longitude as number,
                member.lastPosition.latitude as number,
              ],
            },
          };
        }),
    [data]
  );

  const {clusters, supercluster} = useSupercluster({
    points,
    zoom,
    bounds: [bounds[0] - 1, bounds[1] - 1, bounds[2] + 1, bounds[3] + 1],
    options: {radius: 80, maxZoom: MAX_ZOOM},
  });

  useListen(
    (s) => s.emit("clan:start", clanId),
    (s) => s.emit("clan:stop", clanId)
  );

  useSubscription("clan:user-picture", () =>
    utils.clan.getLastLocations.invalidate()
  );

  useEffect(() => {
    if (!data || data.length === 0) return;

    let mxLongitude = -Infinity;
    let mnLongitude = Infinity;
    let mxLatitude = -Infinity;
    let mnLatitude = Infinity;
    let flag = false;

    for (const curr of data) {
      if (!curr.lastPosition.longitude || !curr.lastPosition.latitude) continue;
      flag = true;
      mxLongitude = Math.max(mxLongitude, curr.lastPosition.longitude);
      mnLongitude = Math.min(mnLongitude, curr.lastPosition.longitude);
      mxLatitude = Math.max(mxLatitude, curr.lastPosition.latitude);
      mnLatitude = Math.min(mnLatitude, curr.lastPosition.latitude);
    }

    if (flag) {
      setNe([mxLongitude, mxLatitude]);
      setSw([mnLongitude, mnLatitude]);
      setPadding(finalPadding);
    }
  }, [data]);

  // Helper methods
  function getAvatarUrlsForCluster(clusterId: number) {
    if (!supercluster) return [];
    return supercluster
      .getLeaves(clusterId)
      .map((leaf) => leaf.properties?.avatarUrl as string) as string[];
  }

  async function onRegionIsChanging() {
    if (!map.current) return;
    const zoom = await map.current?.getZoom();
    const bounds = await map.current?.getVisibleBounds();
    setZoom(zoom);
    setBounds([...(bounds[1] as number[]), ...(bounds[0] as number[])] as BBox);
  }

  if (isLoading || isError) return null;

  return (
    <View {...props}>
      <MapboxGL.MapView
        ref={map}
        className="w-full h-full"
        styleURL={Constants.manifest?.extra?.styleUrl}
        localizeLabels={true}
        scaleBarEnabled={false}
        rotateEnabled={false}
        attributionPosition={{bottom: 4, right: 4}}
        onRegionIsChanging={onRegionIsChanging}
      >
        <MapboxGL.Camera
          bounds={{
            ne,
            sw,
            paddingTop: padding,
            paddingBottom: padding,
            paddingLeft: padding,
            paddingRight: padding,
          }}
          animationMode="none"
          maxZoomLevel={MAX_ZOOM}
        />
        {clusters.map((point, key) => (
          <View key={key}>
            {point.properties?.cluster ? (
              <ClusterMarker
                coordinates={[
                  Number(point.geometry.coordinates[0]),
                  Number(point.geometry.coordinates[1]),
                ]}
                avatarUrls={getAvatarUrlsForCluster(
                  point.properties.cluster_id
                )}
              />
            ) : (
              <IndividualMarker
                coordinates={[
                  Number(point.geometry.coordinates[0]),
                  Number(point.geometry.coordinates[1]),
                ]}
                avatarUrl={point.properties?.avatarUrl as string}
                nickname={point.properties?.nickname as string}
                when={point.properties?.when as Date}
              />
            )}
          </View>
        ))}
      </MapboxGL.MapView>
    </View>
  );
};

export default Map;
