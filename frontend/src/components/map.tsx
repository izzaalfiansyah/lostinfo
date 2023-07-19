import "leaflet/dist/leaflet.css";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { createEffect, createSignal, onMount } from "solid-js";
import { useNotif } from "~/contexts/notif";
import axios from "axios";

interface Props {
  value?: {
    lat?: any;
    lng?: any;
  };
  onChange?: (latlng: LatLng) => void;
  class?: string;
  disabled?: boolean;
}

export default function (props: Props) {
  const [map, setMap] = createSignal<L.Map>(undefined as any);
  const [marker, setMarker] = createSignal<L.Marker>(undefined as any);

  const notif = useNotif();

  const render = () => {
    setMap(
      L.map("map")
        .setView([-8.168959596070266, 113.70214465744915], 15)
        .locate({ setView: true })
    );

    L.tileLayer("https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png", {
      // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
    }).addTo(map());

    if (props.value) {
      makeMarker(props.value as any);
    } else {
      map().on("locationfound", handleLocationFound);
      map().on("locationerror", handleLocationError);
    }

    map().on("click", handleClick);
  };

  const makeMarker = (e: { lat: any; lng: any }) => {
    if (props.disabled) return false;

    if (marker()) {
      marker().remove();
    }
    if (e.lat && e.lng && map()) {
      setMarker(
        L.marker([e.lat, e.lng]).bindPopup(`${e.lat},${e.lng}`)
      ).openPopup();
      marker().addTo(map());

      const latlng = L.latLng(e.lat, e.lng);

      map().setView(latlng).setZoom(17);
    }
  };

  const handleLocationFound = (e: any) => {
    const circle = L.circle(e.latlng, {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 15,
    })
      .bindPopup("Kamu berada di sini")
      .openPopup();

    circle.on("click", (e) => makeMarker(e.latlng));
    circle.addTo(map());

    map().setView(e.latlng).setZoom(17);
  };

  const handleLocationError = (e: any) => {
    notif.show("Gagal menemukan lokasi anda", false);
  };

  const handleClick = (e: LeafletMouseEvent) => {
    if (props.onChange) {
      props.onChange(e.latlng);
    }

    makeMarker(e.latlng);
  };

  createEffect((oldVal: any) => {
    if (oldVal && props.value) {
      if (oldVal.lat != props.value?.lat || oldVal.lng != props.value?.lng) {
        makeMarker(props.value as any);
      }
    }

    return { ...props.value };
  });

  onMount(() => {
    render();
  });

  return (
    <div
      id="map"
      class={"h-64 outline-none bg-gray-100 rounded " + props.class}
    ></div>
  );
}

export const getAddressByLatLng = async (latlng: any) => {
  const { data } = await axios.get(
    "https://nominatim.openstreetmap.org/reverse.php?zoom=18&format=jsonv2",
    {
      params: {
        lat: latlng.lat,
        lng: latlng.lng,
      },
    }
  );

  return data;
};

export const getLatLngByAddress = async (address: string) => {
  const { data } = await axios.get(
    "https://nominatim.openstreetmap.org/search.php?format=jsonv2",
    {
      params: {
        q: address,
      },
    }
  );

  return data;
};
