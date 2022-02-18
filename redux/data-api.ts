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
      query: () => 'get-all',
    }),

    login: builder.query<U.User, { email: string; password_hash: string }>({
      query: (body) => ({
        url: 'log-in',
        method: 'POST',
        body,
      }),
    }),

    updateDevice: builder.mutation<
      D.Device,
      Partial<D.Device> & Pick<D.Device, 'id'>
    >({
      query: (device) => ({
        url: `device/${device.id}`,
        method: 'PATCH',
        body: device,
      }),
    }),

    listDevices: builder.query<D.Device, void>({
      query: () => ({
        url: `device`,
        method: `GET`,
      }),
    }),

    // get device by id
    // get all devices

    // create zone
    // get zone by id
    // get all zones
    // update zone
    // delete zone

    // get all zone groups
    // get zone group by id
    // create zone group
    // update zone group
    // delete zone group
    // add zone to zone group

    // get rule by id
    // get all rules
    // create rule
    // update rule
    // delete rule

    // get user by id
    // get all users
    // create user
    // update user
    // delete user
    // add device to user
  }),
});

export const { useGetAllQuery, useLoginQuery, useUpdateDeviceMutation } =
  dataAPI;
