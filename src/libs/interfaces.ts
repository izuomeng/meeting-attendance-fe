export interface IListResponse<T> {
  list: T[]
}

export interface IUSerEntity {
  id: number
  name: string
  email: string
  phone: string
}

export interface IRoomEntity {
  id: number
  roomName: string
  location: string
}

//  请求/api/meetings返回的数据格式
export interface IMeetingEntity {
  id: string
  title: string
  startTime: string
  endTime: string
  type: number
  state: number
  createBy: string
  createTime: string
  signWay: number
  signTime: string
  collectHz: number
  collectOutInfo: number
  rooms: IRoomEntity[]
  users: IUSerEntity[]
}
