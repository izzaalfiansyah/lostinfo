import "leaflet/dist/leaflet.css";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { createEffect, createSignal, onMount } from "solid-js";
import { useNotif } from "~/contexts/notif";
import axios from "axios";
import { AccountIcon } from "./icons";

interface Props {
  value?: {
    lat?: any;
    lng?: any;
  };
  marks?: Array<{
    lat: any;
    lng: any;
    text?: string;
    color: string;
    onClick?: () => any;
  }>;
  onChange?: (latlng: LatLng) => any;
  onLocationFound?: (latlng: LatLng) => any;
  class?: string;
  disabled?: boolean;
  toMyLocation?: boolean;
}

export default function (props: Props) {
  const [map, setMap] = createSignal<L.Map>(undefined as any);
  const [marker, setMarker] = createSignal<L.Marker>(undefined as any);
  const [myLocation, setMyLocation] = createSignal();

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

    map().setZoom(15);

    map().on("locationfound", handleLocationFound);
    map().on("locationerror", handleLocationError);
    makeMarker(props.value as any);

    map().on("click", handleClick);
  };

  const makeMarker = (e: { lat: any; lng: any }) => {
    if (marker()) {
      marker().remove();
    }

    if (!e) {
      return null;
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

  const showMyLocation = () => {
    map()
      .setView(myLocation() as any)
      .setZoom(15);
  };

  const handleLocationFound = (e: any) => {
    const circle = L.circle(e.latlng, {
      color: "dodgerblue",
      fillColor: "dodgerblue",
      fillOpacity: 0.5,
      radius: 30,
    })
      .bindTooltip("Kamu berada di sini")
      .openTooltip();

    if (!props.disabled) {
      circle.on("click", (e) => makeMarker(e.latlng));
    }

    circle.addTo(map());
    setMyLocation(e.latlng);

    if (props.toMyLocation) {
      showMyLocation();
    }

    if (props.onLocationFound) {
      props.onLocationFound(e.latlng);
    }
  };

  const handleLocationError = (e: any) => {
    notif.show("Gagal menemukan lokasi anda", false);
  };

  const handleClick = (e: LeafletMouseEvent) => {
    if (props.disabled) return false;
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
    return props.value;
  });

  createEffect((oldMarks) => {
    if (oldMarks != props.marks) {
      props.marks?.forEach((item) => {
        const latlng = {
          lat: item.lat,
          lng: item.lng,
        };
        const content = item.text || `${item.lat},${item.lng}`;

        const tooltip = L.tooltip().setLatLng(latlng).setContent(content);
        const circle = L.circle(latlng, {
          color: item.color,
          fillColor: item.color,
          fillOpacity: 0.5,
          radius: 20,
        })
          .bindTooltip(tooltip)
          .openTooltip();

        if (item.onClick) {
          circle.on("click", item.onClick);
        }

        circle.addTo(map());
      });
    }

    return props.marks;
  });

  onMount(() => {
    render();
  });

  return (
    <div class="relative grow flex flex-col">
      <div class="border border-[2px] border-[rgba(0,0,0,0.2)] absolute top-[10px] right-[10px] rounded z-[800] ">
        <button
          class="block bg-white hover:bg-gray-100 h-[30px] w-[30px] flex items-center justify-center rounded"
          type="button"
          title="Tunjukkan Lokasi Saya"
          onClick={showMyLocation}
        >
          <AccountIcon class="w-4 h-4 fill-gray-800" />
        </button>
      </div>
      <div
        id="map"
        class={"h-64 outline-none bg-gray-100 rounded " + props.class}
      ></div>
    </div>
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
