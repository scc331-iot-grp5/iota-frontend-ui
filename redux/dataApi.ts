import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import CONSTANTS from '../constants';
import * as D from '../types/device';
import * as M from '../types/map';
import * as R from '../types/rule';
import * as U from '../types/user';

interface DataState {
  devices: D.Device[];
  readings: D.Reading[];
  device_types: D.Type[];

  map_zones: M.Zone[];
  map_zone_groups: M.ZoneGroup[];

  rules: R.Rule[];
  events: R.Event[];

  users: U.User[];
  read_rights: U.ReadRight[];
}

export const dataAPI = createApi({
  reducerPath: 'data',
  baseQuery: fetchBaseQuery({ baseUrl: `${CONSTANTS.BACKEND_URL}/` }),
  endpoints: (builder) => ({
    getAll: builder.query<DataState, void>({
      query: () => 'get-all-v2',
    }),
    login: builder.query<U.User, { username: string; password_hash: string }>({
      query: (body) => ({
        url: 'log-in-v2',
        method: 'POST',
        body,
      }),
    }),

    updateDevice: builder.mutation<D.Device, D.Device>({
      query: (device) => ({
        url: 'set-device-state',
        method: 'POST',
        body: device,
      }),
    }),

    // create zone
    // update zone
    // delete zone

    // create zone group
    // update zone group
    // delete zone group
    // add zone to zone group

    // create rule
    // update rule
    // delete rule

    // create user
    // update user
    // delete user
    // add device to user
  }),
});

export const { useGetAllQuery, useLoginQuery, useUpdateDeviceMutation } =
  dataAPI;
