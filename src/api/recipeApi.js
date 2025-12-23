import api from '@/api/index'

const BASE_URL = '/recipes'

export default {
  // AI 추천 레시피
  getAiRecommendations(selectedItems = []) {
    return api
      .post(`${BASE_URL}/recommend/ai`, {
        selected_items: selectedItems,
      })
      .then((res) => res)
  },

  // 인기 레시피
  getPopularRecipes() {
    return api.get(`${BASE_URL}/recommend/popular`)
  },

  // 15분 스피드 레시피
  getSpeedRecipes() {
    return api.get(`${BASE_URL}/recommend/speed`)
  },

  // 레시피 상세 정보 조회
  getRecipeDetail(recipeVideoId, includeMemo = false) {
    return api.get(`${BASE_URL}/${recipeVideoId}/detail`, {
      params: { include_memo: includeMemo },
    })
  },

  // 레시피 좋아요
  buttonLike(recipeVideoId) {
    return api.post(`${BASE_URL}/${recipeVideoId}/like`)
  },

  // 레시피 완료
  buttonComplete(recipeVideoId) {
    return api.post(`${BASE_URL}/${recipeVideoId}/complete`)
  },

  // 메모 등록
  createMemo(recipeVideoId, content) {
    return api.post(`${BASE_URL}/${recipeVideoId}/memo`, {
      content: content,
    })
  },

  // 메모 삭제
  deleteMemo(recipeVideoId, memoId) {
    return api.delete(`${BASE_URL}/${recipeVideoId}/memo/${memoId}`)
  },
}
