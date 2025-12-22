import api from '@/api/index'
const BASE_URL = '/user'

export default {
  // 회원가입
  signup(formData) {
    return api.post(`${BASE_URL}/signup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 이메일 중복 체크
  checkEmailDuplicate(email) {
    return api.get(`${BASE_URL}/email/check`, {
      params: { email: email },
    })
  },

  // 로그인
  login(data) {
    return api.post(`${BASE_URL}/login`, data)
  },

  // 로그아웃
  logout() {
    return api.post(`${BASE_URL}/logout`)
  },
  // 토큰 재발급
  reissue() {
    return api.post(`${BASE_URL}/reissue`)
  },
  // 회원탈퇴
  withdraw() {
    return api.patch(`${BASE_URL}/withdraw`)
  },

  // 프로필 조회
  getProfile() {
    return api.get(`${BASE_URL}/info`)
  },

  // 프로필 수정
  updateProfile(formData) {
    return api.patch(`${BASE_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 프로필 이미지 삭제
  deleteProfileImage() {
    return api.patch(`${BASE_URL}/image`)
  },

  // 비밀번호 확인
  checkPassword(password) {
    return api.post(`${BASE_URL}/password/check`, password)
  },

  // 비밀번호 변경
  changePassword(data) {
    return api.post(`${BASE_URL}/password`, data)
  },

  // 아이디 찾기
  findId(data) {
    return api.post(`${BASE_URL}/find/id`, data)
  },

  // 비밀번호 찾기
  findPassword(data) {
    return api.post(`${BASE_URL}/find/password`, data)
  },
}
