## 0.1.9（2017-12-07）

### 解决bug

- fix preact的热替换问题 

### 更新

无

### 新功能

无

## 0.1.7（2017-10-26）

### 解决bug

- fix Controller.js中 ControllerConfig.readViewFile的firstLoad参数不正确问题

### 更新

无

### 新功能

无

## 0.1.6（2017-10-25）

### 解决bug

### 更新

无

### 新功能

- indexPath 新增函数处理方式

## 0.1.5（2017-09-11）

### 解决bug

- 解决viewId带“-”字符，controller中xxxView函数执行问题
  eg. viewId=status-test的会执行statusTestView方法

### 更新

无

### 新功能

无

## 0.1.0（2017-08-24）

### 解决bug

无

### 更新

无

### 新功能

- 新增plugin功能
- 新增i18n plugin

## 0.0.9（2017-08-22）

### 解决bug

-  fix 主页重定向后页面空白问题 

### 更新

无

### 新功能

无

## 0.0.7（2017-08-15）

### 解决bug

-  fix BrowserRouter在页面重载时，引起的多一次渲染问题

### 更新

无

### 新功能

无

## 0.0.6（2017-08-14）

### 解决bug

-  fix suffixTitle问题

### 更新

无

### 新功能

- 添加了同一个controller之间view可以通讯功能（之间类直接变量通讯）

## 0.0.5（2017-08-14）

### 解决bug

- [fix run build-demo失败问题](https://github.com/dog-days/react-router-controller/commit/0c5e9ba883bd29a5c42c1fc6f7ac6942c508a538)

### 更新

- remove `<switch/>` 

### 新功能

- [add polyfill.js](https://github.com/dog-days/react-router-controller/commit/5918a57c4a09df187297ecb5f8f8fdc75b7640e7)

## 0.0.3 && 0.0.4（2017-08-14）

### 解决bug

无

### 更新

无

### 新功能

- src/Controller的set方法中，readViewFile添加新参数firstLoad，用来判断当前函数，view文件是否是第一次载入。

