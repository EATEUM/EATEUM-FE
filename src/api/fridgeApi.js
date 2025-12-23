import api from '@/api/index'

const BASE_URL = '/fridges'

export default {
  // 냉장고 재료 목록 조회
  getFridgeItems(page = 1, size = 50) {
    return api.get(BASE_URL, {
      params: {
        page: page,
        size: size,
      },
    })
  },

  // 냉장고 재료 삭제
  deleteFridgeItem(itemId) {
    return api.delete(`${BASE_URL}/${itemId}`)
  },
}
