import { api } from "@/plugins/api";

const TestServices = {
  getAll(level: number, limit: number = 30) {
    return api.get(
      `list-jlpt/${level}?limit=${limit}`
    )
  },
  getTestDetail(id: string) {
    return api.get(
      `jlpt/${id}`
    )
  }
}

export default TestServices
