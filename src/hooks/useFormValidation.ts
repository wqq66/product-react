import { useState } from 'react';

// ===== 第 1 步：定义规则类型 =====
// 每条规则就是一个条件，比如 "必填"、"最小长度"
export interface ValidationRule {
  required?: boolean;       // 是否必填
  minLength?: number;        // 最少几个字符
  maxLength?: number;        // 最多几个字符
  pattern?: RegExp;          // 正则匹配（比如邮箱格式）
  patternMessage?: string;   // 正则不匹配时显示的错误
  matchField?: string;       // 必须和另一个字段值相同（比如确认密码）
}

// ===== 第 2 步：检查单个字段是否合法 =====
// 遍历这个字段的所有规则，返回第一条错误信息
// 如果都通过了，返回 null（表示没有错误）
function checkField(
  value: string,
  rules: ValidationRule[],
  allValues: Record<string, string>,
): string | null {
  for (const rule of rules) {
    // 必填检查
    if (rule.required && value.trim() === '') {
      return 'This field is required';
    }
    // 最小长度检查
    if (rule.minLength && value.trim().length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`;
    }
    // 最大长度检查
    if (rule.maxLength && value.trim().length > rule.maxLength) {
      return `Must be at most ${rule.maxLength} characters`;
    }
    // 正则格式检查
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.patternMessage ?? 'Invalid format';
    }
    // 字段匹配检查（确认密码 = 密码）
    if (rule.matchField && value !== allValues[rule.matchField]) {
      return 'Fields do not match';
    }
  }
  return null; // 全部通过
}

// ===== 第 3 步：核心 Hook =====
// 接收"初始值"和"验证规则"，返回表单需要的所有状态和方法
export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  rules: Record<keyof T, ValidationRule[]>,
) {
  // --- 三个核心状态 ---
  // React 的 useState 相当于 Vue 的 ref()
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // --- 方法 1：输入框内容变化时调用 ---
  // 做了两件事：①更新值  ②清除该字段的错误
  function handleChange(field: keyof T) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      // ① 更新值：用展开运算符创建新对象（React 要求不可变更新）
      setValues({ ...values, [field]: e.target.value });

      // ② 如果这个字段之前有错误，清除它（用户已经开始修改了）
      if (errors[field as string]) {
        const newErrors = { ...errors };
        delete newErrors[field as string];
        setErrors(newErrors);
      }
    };
  }

  // --- 方法 2：输入框失去焦点时调用 ---
  // 做了两件事：①标记为"已触碰"  ②验证当前字段
  function handleBlur(field: keyof T) {
    return function () {
      // ① 标记已触碰（用于控制错误显示的时机）
      setTouched({ ...touched, [field]: true });

      // ② 验证当前字段
      const fieldRules = rules[field] ?? [];
      const error = checkField(values[field], fieldRules, values);

      if (error) {
        setErrors({ ...errors, [field]: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors[field as string];
        setErrors(newErrors);
      }
    };
  }

  // --- 方法 3：表单提交时调用 ---
  // 做了三件事：①标记全部字段为已触碰  ②验证全部字段  ③如果通过，执行回调
  function handleSubmit(onValid: (data: T) => void) {
    return function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault(); // 阻止浏览器的默认表单提交

      // ① 全部标记为已触碰（让所有错误都显示出来）
      const allTouched: Record<string, boolean> = {};
      for (const key of Object.keys(rules)) {
        allTouched[key] = true;
      }
      setTouched(allTouched);

      // ② 逐个验证
      const newErrors: Record<string, string> = {};
      for (const field of Object.keys(rules) as (keyof T)[]) {
        const fieldRules = rules[field] ?? [];
        const error = checkField(values[field], fieldRules, values);
        if (error) {
          newErrors[field as string] = error;
        }
      }
      setErrors(newErrors);

      // ③ 没有错误 → 调用回调函数（比如打印日志、发 API 请求）
      if (Object.keys(newErrors).length === 0) {
        onValid(values);
      }
    };
  }

  // --- 返回给组件使用 ---
  return {
    values,       // 所有字段的当前值，如 { email: 'a@b.com', password: '123' }
    errors,       // 所有字段的错误信息，如 { email: '格式不正确' }
    touched,      // 哪些字段被触碰过，如 { email: true }
    handleChange, // 绑定到 input 的 onChange
    handleBlur,   // 绑定到 input 的 onBlur
    handleSubmit, // 绑定到 form 的 onSubmit
  };
}
