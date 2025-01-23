import axios from "axios";

//baseURL, timeout 등 기본 설정을 가진 Axios 인스턴스
const apiAxios = axios.create({
  //Header 설정 필요없이 쿠키 사용
  baseURL: "http://localhost:9999",
  withCredentials: true, // 쿠키 포함
});
//요청 인터셉터 추가
apiAxios.interceptors.request.use(
  (config) => {
    console.log('request')
    //요청 전처리 부분
    console.log(config.method.toUpperCase(), ' - ', config.url);
    return config;
  },
  (error) => {
    //요청에 에러가 발생했을때 처리부분
    console.log(error)
    return Promise.reject(error);
  }
);

//응답 인터셉터 추가
apiAxios.interceptors.response.use(
  (response) => {
    //응답 전처리 부분
    console.log('reponse')
    console.log(response.data);
    console.log(response.config.method.toUpperCase(), ' - ', response.config.url);
    return response;
  },
  (error) => {  
    //응답에 에러가 발생했을때 처리부분
    console.log(error)
    return Promise.reject(error);
  }
)
export default apiAxios;