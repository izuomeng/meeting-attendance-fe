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
}

//  请求/api/meetings返回的数据格式
export interface IMeeting {
  id: string
  title: string
  startTime: string
  endTime: string
  type: number
  state: number
  createBy: string
  createTime: string
  rooms: IRoomEntity[]
  users: IUSerEntity[]
}
