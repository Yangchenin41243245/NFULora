# React Native 開發環境安裝指南

本文件說明如何在 Windows 上安裝 React Native 開發所需環境，包含：

* Android Studio
* Node.js
* npm
* Java
* Git
* 環境變數設定
* React Native 開發工具
* 開啟與執行專案

---

# 1 安裝 Git

安裝 **Git** 以便從 GitHub 下載專案。

## 下載

[https://git-scm.com/downloads](https://git-scm.com/downloads)

## 安裝步驟

1. 下載 Windows installer
2. 按 **Next** 直到完成
3. 使用預設設定即可

## 確認安裝

```bash
git --version
```

若顯示版本號代表安裝成功。

---

# 2 安裝 Node.js 與 npm

React Native 需要 **Node.js** 與 **npm**。

## 下載

[https://nodejs.org](https://nodejs.org)

建議下載 **LTS版本**

## 安裝

直接執行 installer，使用預設設定。

Node.js 安裝時會自動包含 npm。

## 確認安裝

```bash
node -v
npm -v
```

---

# 3 安裝 Java (JDK)

Android build 需要 **Java**。

建議使用 **JDK 17**

## 下載

[https://adoptium.net/](https://adoptium.net/)

下載：

```
OpenJDK 17
```

## 確認安裝

```bash
java -version
```

---

# 4 安裝 Android Studio

安裝 **Android Studio** 來取得 Android SDK。

## 下載

[https://developer.android.com/studio](https://developer.android.com/studio)

## 安裝流程

1. 下載 Android Studio
2. 執行 installer
3. 選擇 **Standard Install**
4. 讓系統自動下載：

* Android SDK
* Android SDK Platform
* Android Virtual Device
* Gradle

安裝完成後開啟 Android Studio。

---

# 5 設定環境變數

React Native 需要 Android SDK 環境變數。

## 找到 SDK 位置

通常在：

```
C:\Users\你的帳號\AppData\Local\Android\Sdk
```

## 開啟環境變數設定

Windows：

```
控制台
→ 系統
→ 進階系統設定
→ 環境變數
```

---

## 新增系統變數

新增：

```
變數名稱
ANDROID_HOME

變數值
C:\Users\你的帳號\AppData\Local\Android\Sdk
```

---

## 修改 Path

在 **Path** 中新增：

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

---

## 測試

開新 terminal：

```bash
adb --version
```

若顯示版本代表成功。

---

# 6 安裝 React Native CLI

React Native 可透過 **React Native** CLI 建立或執行專案。

使用 npx 即可：

```bash
npx react-native --version
```

---

# 7 下載專案

使用 Git 下載專案：

```bash
git clone https://github.com/你的帳號/你的專案.git
```

進入專案資料夾：

```bash
cd 專案名稱
```

---

# 8 安裝專案依賴

React Native 需要下載 node_modules：

```bash
npm install
```

---

# 9 安裝 React Native BLE 套件 (如果專案需要)

例如 BLE library：

```bash
npm install react-native-ble-plx
```

BLE 套件通常需要重新 build。

---

# 10 建立 Android 模擬器 (Android Virtual Device)

在執行 React Native 專案前，建議先建立 Android 模擬器。

Android 模擬器由 **Android Studio** 內建的 **AVD (Android Virtual Device)** 提供。

## 10.1 開啟 Device Manager

開啟 Android Studio

選擇：

Tools  
→ Device Manager

或在主畫面點擊：

Device Manager

## 10.2 建立新模擬器

點擊：

Create Device

## 10.3 選擇裝置

建議選擇：

Pixel 6  
或  
Pixel 5

點擊：

Next

## 10.4 選擇 Android 系統映像

若尚未下載，需要先下載。

建議版本：

Android 13 (API 33)

或

Android 14 (API 34)

點擊：

Download

下載完成後按：

Next

## 10.5 完成模擬器建立

確認設定後點擊：

Finish

此時 Device Manager 會出現新的模擬器。

## 10.6 啟動模擬器

在 Device Manager 中點擊：

▶ (Play 按鈕)

模擬器會啟動 Android 系統。

---

# 11 啟動 React Native 專案

當模擬器啟動後，即可執行 React Native 專案。

## 11.1 啟動 Metro Server

```bash
npx react-native start
```

## 11.2 建置並執行 Android App

開另一個 terminal：

```bash
npx react-native run-android
```

系統會：

* 建立 APK
* 啟動模擬器
* 安裝 APP

第一次 build 會下載 Gradle 依賴，可能需要幾分鐘。

---

# 12 開啟 Android 專案 (Android Studio)

若需要修改 Android 原生設定：

1. 開啟 Android Studio
2. 選擇

```
Open Project
```

3. 選擇資料夾：

```
project/android
```

Android Studio 會自動同步 Gradle。


# 13 React Native 開發流程

一般開發流程：

```
git clone 專案
npm install
npx react-native start
npx react-native run-android
```
