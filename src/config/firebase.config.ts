// Firebase 配置
export const firebaseConfig = {
  apiKey: "AIzaSyDjqB-1G75KaLIZjONO2z-ESmurAa-q_SU",
  authDomain: "childanalysis-32c23.firebaseapp.com",
  projectId: "childanalysis-32c23",
  storageBucket: "childanalysis-32c23.firebasestorage.app",
  messagingSenderId: "122447488436",
  appId: "1:122447488436:web:eae0d0c2d1cba045867ee1"
};

// 开发模式配置
export const DEV_MODE = false; // 设为 true 启用测试验证码

// 测试手机号和验证码（仅开发使用）
export const TEST_PHONE_NUMBERS: Record<string, string> = {
  '+8613800138000': '123456',
  '+8612345678901': '111111',
};
