import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import CONSTANTS from '../constants';
import * as D from '../types/device';
import * as M from '../types/map';
import * as R from '../types/rule';
import * as U from '../types/user';

const normaliseDateString = (dStr: string) =>
  ((d) =>
    `${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`)(
    new Date(dStr)
  );

export const dataAPI = createApi({
  reducerPath: 'data',
  baseQuery: fetchBaseQuery({ baseUrl: `${CONSTANTS.BACKEND_URL}/` }),
  endpoints: (builder) => ({
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
        method: 'POST',
        body: device,
      }),
    }),

    listDevices: builder.query<D.Device[], { userId?: number }>({
      query: ({ userId }) => ({
        url: 'device',
        params: userId ? { user_id: userId } : undefined,
        method: 'GET',
      }),
    }),

    // get device by id
    getDevice: builder.query<D.Device, number>({
      query: (id) => ({
        url: `device/${id}`,
        method: 'GET',
      }),
    }),

    // update device config
    editDevice: builder.mutation<
      D.Device,
      (Partial<D.Device> & Pick<D.Device, 'id'>) | Omit<D.Device, 'sensor_set'>
    >({
      query: (d) => ({
        url: `device/${d.id}`,
        method: 'POST',
        body: d,
      }),
    }),

    // get all device types
    listDeviceTypes: builder.query<D.Type[], null>({
      query: () => ({
        url: 'device_type',
        method: 'GET',
      }),
    }),

    // get device type by id
    getDeviceType: builder.query<D.Type, number>({
      query: (id) => ({
        url: `device/${id}`,
        method: 'GET',
      }),
    }),

    // create device type
    createDeviceType: builder.mutation<D.Type, Omit<D.Type, 'id'>>({
      query: (u) => ({
        url: 'device_type',
        method: 'POST',
        body: u,
      }),
    }),

    // delete device type
    deleteDeviceType: builder.mutation<void, number>({
      query: (id) => ({
        url: `device_type/${id}`,
        method: 'DELETE',
      }),
    }),

    // edit device type
    editDeviceType: builder.mutation<
      D.Type,
      Partial<D.Type> & Pick<D.Type, 'id'>
    >({
      query: (t) => ({
        url: `device/${t.id}`,
        method: 'POST',
        body: t,
      }),
    }),

    // create zone
    createZone: builder.mutation<M.Zone, Omit<M.Zone, 'id'>>({
      query: (z) => ({
        url: 'zone',
        method: 'POST',
        body: { ...z, geo_json: `"${JSON.stringify(z.geo_json)}"` },
      }),
    }),

    // get zone by id
    getZone: builder.query<M.Zone, number>({
      query: (id) => ({
        url: `zone/${id}`,
        method: 'GET',
      }),
    }),

    // get all zones
    listZones: builder.query<M.Zone[], null>({
      query: () => ({
        url: 'zone',
        method: 'GET',
      }),
    }),

    // update zone
    editZone: builder.mutation<M.Zone, Partial<M.Zone> & Pick<M.Zone, 'id'>>({
      query: (z) => ({
        url: `zone/${z.id}`,
        method: 'POST',
        body: {
          ...z,
          geo_json:
            typeof z.geo_json === 'undefined'
              ? undefined
              : JSON.stringify(z.geo_json),
        },
      }),
    }),

    // delete zone
    deleteZone: builder.mutation<void, number>({
      query: (id) => ({
        url: `zone/${id}`,
        method: 'DELETE',
      }),
    }),

    // create zone group
    createZoneGroup: builder.mutation<M.ZoneGroup, Omit<M.ZoneGroup, 'id'>>({
      query: (z) => ({
        url: 'zone_group',
        method: 'POST',
        body: z,
      }),
    }),

    // get all zone groups
    listZoneGroups: builder.query<M.ZoneGroup[], null>({
      query: () => ({
        url: 'zone_group',
        method: 'GET',
      }),
    }),

    // get zone group by id
    getZoneGroup: builder.query<M.ZoneGroup, number>({
      query: (id) => ({
        url: `zone_group/${id}`,
        method: 'GET',
      }),
    }),

    // edit zone group
    editZoneGroup: builder.mutation<
      M.ZoneGroup,
      | (Partial<M.ZoneGroup> & Pick<M.ZoneGroup, 'id'>)
      | Omit<M.ZoneGroup, 'members'>
    >({
      query: (zg) => ({
        url: `zone_group/${zg.id}`,
        method: 'POST',
        body: zg,
      }),
    }),

    // delete zone group
    deleteZoneGroup: builder.mutation<void, number>({
      query: (id) => ({
        url: `zone_group/${id}`,
        method: 'DELETE',
      }),
    }),

    // set zone group membership
    setZoneGroupMembership: builder.mutation<
      void,
      { zone_id: number; group_id: number; member: boolean }
    >({
      query: ({ zone_id: zId, group_id: gId, member }) => ({
        url: `zone_group/${gId}/member/${zId}`,
        method: 'PUT',
        body: { member },
      }),
    }),

    // create zone group var
    createZoneVar: builder.mutation<M.ZoneGroupVar, Omit<M.ZoneGroupVar, 'id'>>(
      {
        query: (zv) => ({
          url: 'zone_var',
          method: 'POST',
          body: zv,
        }),
      }
    ),

    // list all zone group vars
    listZoneVars: builder.query<M.ZoneGroupVar[], null>({
      query: () => ({
        url: 'zone_var',
        method: 'GET',
      }),
    }),

    // get zone group var by id
    getZoneVar: builder.query<M.ZoneGroupVar, number>({
      query: (id) => ({
        url: `zone_var/${id}`,
        method: 'GET',
      }),
    }),

    // delete zone group var
    deleteZoneVar: builder.mutation<void, number>({
      query: (id) => ({
        url: `zone_var/${id}`,
        method: 'DELETE',
      }),
    }),

    // edit zone group var
    editZoneVar: builder.mutation<
      M.ZoneGroupVar,
      Partial<M.ZoneGroupVar> & Pick<M.ZoneGroupVar, 'id'>
    >({
      query: (zv) => ({
        url: `zone_var/${zv.id}`,
        method: 'POST',
      }),
    }),

    // set zone group var value for zone
    setZoneVarValue: builder.mutation<
      any,
      { var_id: number; zone_id: number; value: any }
    >({
      query: ({ value, var_id: vId, zone_id: zId }) => ({
        url: `zone_var/${vId}/value/${zId}`,
        method: 'PUT',
        body: value,
      }),
    }),

    // get zone group var value for zone
    getZoneVarValue: builder.query<any, { var_id: number; zone_id: number }>({
      query: ({ var_id: vId, zone_id: zId }) => ({
        url: `zone_var/${vId}/value/${zId}`,
        method: 'GET',
      }),
    }),

    // get rule by id
    getRule: builder.query<R.Rule, number>({
      query: (id) => ({
        url: `rule/${id}`,
        method: 'GET',
      }),
    }),

    // get all rules
    listRules: builder.query<R.Rule[], { userId?: number }>({
      query: ({ userId }) => ({
        url: `rule`,
        params: userId ? { user_id: userId } : undefined,
        method: 'GET',
      }),
    }),

    // create rule
    createRule: builder.mutation<R.Rule, R.Rule & Omit<R.Rule, 'id'>>({
      query: (r) => ({
        url: `rule`,
        method: 'POST',
        body: {
          ...r,
          body: `"${JSON.stringify(r.body)}"`,
        },
      }),
    }),

    // update rule
    editRule: builder.mutation<R.Rule, Partial<R.Rule> & Pick<R.Rule, 'id'>>({
      query: (r) => ({
        url: `rule/${r.body}`,
        method: 'POST',
        body: {
          ...r,
          body:
            typeof r.body === 'undefined'
              ? undefined
              : `"${JSON.stringify(r.body)}"`,
        },
      }),
    }),

    // delete rule
    deleteRule: builder.mutation<void, number>({
      query: (id) => ({
        url: `rule/${id}`,
        method: 'DELETE',
      }),
    }),

    // list all events
    listEvents: builder.query<R.Event[], { userId?: number }>({
      query: ({ userId }) => ({
        url: `event`,
        params: userId ? { user_id: userId } : undefined,
        method: 'GET',
      }),
    }),
    // get event by id
    getEvent: builder.query<R.Event, number>({
      query: (id) => ({
        url: `event/${id}`,
        method: 'GET',
      }),
    }),

    // list all readings
    listReadings: builder.query<
      D.Reading[],
      { userId?: number; deviceId?: number }
    >({
      query: ({ userId, deviceId }) => ({
        url: 'reading',
        params:
          userId || deviceId
            ? { user_id: userId, device_id: deviceId }
            : undefined,
        method: 'GET',
      }),
    }),
    // get reading by id
    getReading: builder.query<D.Reading, number>({
      query: (id) => ({
        url: `reading/${id}`,
        method: 'GET',
      }),
    }),

    // get user by id
    getUser: builder.query<U.User, number>({
      query: (userId) => ({
        url: `user/${userId}`,
        method: 'GET',
      }),
    }),

    // get all users
    listUsers: builder.query<U.User[], null>({
      query: () => ({
        url: 'user',
        method: 'GET',
      }),
    }),

    // create user
    createUser: builder.mutation<U.User, Omit<U.User, 'id'>>({
      query: (u) => ({
        url: 'user',
        method: 'POST',
        body: {
          ...u,
          created_at: normaliseDateString(u.created_at),
        },
      }),
    }),

    // update user
    editUser: builder.mutation<U.User, Partial<U.User> & Pick<U.User, 'id'>>({
      query: (u) => ({
        url: `user/${u.id}`,
        method: 'POST',
        body: {
          ...u,
          created_at:
            typeof u.created_at === 'undefined'
              ? undefined
              : normaliseDateString(u.created_at),
        },
      }),
    }),

    // delete user
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
    }),

    // read all device access values for user
    getReadRights: builder.query<U.ReadRight[], {}>({
      query: () => ({
        url: `user_can_read_devices`,
        method: 'GET',
      }),
    }),

    // add device to user
    grantReadToUser: builder.mutation<
      boolean,
      { userId: number; deviceId: number; grant: boolean }
    >({
      query: ({ userId, deviceId, grant }) => ({
        url: `user/${userId}/read/${deviceId}`,
        method: 'PUT',
        body: { grant },
      }),
    }),
    checkUserCanAccessDevice: builder.query<
      boolean,
      { userId: number; deviceId: number }
    >({
      query: ({ userId, deviceId }) => ({
        url: `user/${userId}/read/${deviceId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateDeviceTypeMutation,
  useCreateRuleMutation,
  useCreateUserMutation,
  useCreateZoneGroupMutation,
  useCreateZoneMutation,
  useCreateZoneVarMutation,

  useDeleteDeviceTypeMutation,
  useDeleteRuleMutation,
  useDeleteUserMutation,
  useDeleteZoneGroupMutation,
  useDeleteZoneMutation,
  useDeleteZoneVarMutation,

  useEditDeviceMutation,
  useEditDeviceTypeMutation,
  useEditRuleMutation,
  useEditUserMutation,
  useEditZoneGroupMutation,
  useEditZoneMutation,
  useEditZoneVarMutation,

  useGrantReadToUserMutation,

  useUpdateDeviceMutation,

  useSetZoneGroupMembershipMutation,
  useSetZoneVarValueMutation,

  useCheckUserCanAccessDeviceQuery,

  useGetDeviceQuery,
  useGetDeviceTypeQuery,
  useGetEventQuery,
  useGetReadingQuery,
  useGetRuleQuery,
  useGetUserQuery,
  useGetZoneGroupQuery,
  useGetZoneQuery,
  useGetZoneVarQuery,
  useGetZoneVarValueQuery,
  useGetReadRightsQuery,

  useListDevicesQuery,
  useListDeviceTypesQuery,
  useListEventsQuery,
  useListReadingsQuery,
  useListRulesQuery,
  useListUsersQuery,
  useListZoneGroupsQuery,
  useListZoneVarsQuery,
  useListZonesQuery,

  useLoginQuery,
} = dataAPI;
