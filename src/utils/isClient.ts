import { setupAPIClient } from "@/services/api"

export async function setConfigUserFromEnv() {
  const apiClient = setupAPIClient()
  const user = await apiClient.get('/')
  return user.data
}

