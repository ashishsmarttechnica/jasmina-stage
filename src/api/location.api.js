import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchLocationData = async ({ queryKey }) => {
  const [_, latitude, longitude] = queryKey;

  const { data } = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  );

  return data;
};

export const useLocationQuery = (latitude, longitude) => {
  return useQuery({
    queryKey: ["location", latitude, longitude],
    queryFn: fetchLocationData,
    enabled: !!latitude && !!longitude,
  });
};
