/*
 * @Author: ZhangBo
 * @Date: 2022-04-01 13:26:00
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-09 09:37:28
 * @FilePath: \supermap3d-framework\.eslintrc.js
 * @Description:
 *
 * Copyright (c) 2022 by ZhangBo/SIPSD, All Rights Reserved.
 */

module.exports = {
  // 环境定义了预定义的全局变量。
  env: {
    //环境定义了预定义的全局变量。更多在官网查看
    browser: true,
    node: true,
    commonjs: true,
    amd: true,
    es6: true,
    mocha: true,
  },
  // JavaScript 语言选项
  parserOptions: {
    parser: 'babel-eslint',
  },
  //-----让eslint支持 JSX start
  parser: 'vue-eslint-parser',
  plugins: [],
  extends: [],
  /**
   * "off" 或 0 - 关闭规则
   * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    // // 强制使用一致的缩进，2个空格
    // indent: ['error', 2],
    // // 禁止空格和 tab 的混合缩进
    // 'no-mixed-spaces-and-tabs': 'error',
    // // 强制在注释中 // 或 /* 使用一致的空格
    // 'spaced-comment': 'error',
    // // 强制使用一致的单引号
    // quotes: ['error', 'single'],
    // // 要求对象字面量属性名称用引号括起来
    // //"quote-props": ["error", "always"],
    // // 要求在语句末尾使用分号
    // semi: ['error', 'always'],
    // // 禁止不必要的分号
    // 'no-extra-semi': 'error',
    // // 强制分号之后有空格，禁止分号之前有空格
    // 'semi-spacing': 'error',
    // // 强制分号出现在句子末尾
    // 'semi-style': ['error', 'last'],
    // // 强制使用 Unix 换行符: \n
    // 'linebreak-style': ['error', 'unix'],
  },
};
