# react-cascader-infinite


## 使用

````js

const handleOnchange = (selected, value) => {
  console.log(selected, value)
}
<ReactCascaderTransfer
  data={{
    children: city,
    title: "省",
    defaultValue:[350206],
    disabledValue:[31,330100,350206123]
  }}
  onChange={handleOnchange}
/>
```

## clone到本地运行
```js
npm install
npm start
```


