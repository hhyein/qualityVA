import axios from 'axios'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { PORT } from '../const'

const fetchData = async route => {
  try {
    const res = await axios.get(
      `http://${window.location.hostname}:${PORT}${route}?${Math.random()}`
    )
    return res.data
  } catch (e) {
    console.log(`ERROR - ${e.message}`)
    return undefined
  }
}

const postData = async (route, params, config) => {
  try {
    const res = await axios.post(
      `http://${window.location.hostname}:${PORT}${route}?${Math.random()}`,
      params,
      config
    )
    return res.data
  } catch (e) {
    console.log(`ERROR - ${e.message}`)
    return undefined
  }
}

const FileDataContext = React.createContext()

export const FileDataProvider = ({ children }) => {
  const [file, setFile] = useState()
  const [settingValues, setSettingValues] = useState({
    purpose: undefined,
    column: undefined,
    model: undefined,
    eval: undefined,
  })

  const [purposeList, setPurposeList] = useState()
  const [settingData, setSettingData] = useState({})
  const [combinationTableData, setCombinationTableData] = useState({})
  const [combinationTableSortingInfo, setCombinationTableSortingInfo] = useState({})
  const [selectedCombinationTableRow, setSelectedCombinationTableRow] = useState()
  const [combinationValue, setCombinationValue] = useState({})

  // 콤비-세팅가서 value 세팅한 후에 postCombinationValue실행하면 보내질거얌
  // const postCombinationValue = async () => {
  //   await postData('/combinationSetting ', combinationValue);
  // };

  const isEmptyData = data => {
    return Object.values(data).some(value => value === undefined)
  }

  const handleSettingValuesChange = useCallback(async () => {
    if (Object.values(settingValues).some(value => value === undefined)) {
      return
    }
    await postData('/setting', settingValues)
  }, [settingValues])

  useEffect(() => {
    handleSettingValuesChange()
  }, [handleSettingValuesChange])

  const updatePurposeList = useCallback(async () => {
    const { purposeList } = await fetchData('/setting')
    setPurposeList(purposeList)
  }, [])

  const handlePurposeChange = useCallback(async () => {
    if (!settingValues.purpose) {
      return
    }
    setCombinationTableSortingInfo(prev => ({
      ...prev,
      isAscending: settingValues.purpose.label === 'prediction',
    }))
    await postData('/setting', settingValues)
    const { columnList, modelList, evalList, dimensionList } = await fetchData('/setting')
    setSettingData({
      columnList,
      modelList,
      evalList,
      dimensionList,
    })
  }, [settingValues.purpose])

  const handleDrop = useCallback(
    async files => {
      setFile(files[0])
      var formData = new FormData()
      const config = {
        header: { 'content-type': 'multipart/form-data' },
      }
      formData.append('file', files[0])
      await postData('/fileUpload', formData, config)
      await updatePurposeList()
    },
    [updatePurposeList]
  )

  useEffect(() => {
    handlePurposeChange()
  }, [handlePurposeChange])

  const updateCombinationTable = useCallback(async () => {
    const combinationData = await fetchData('/combination')
    setCombinationTableSortingInfo(prev => ({
      ...prev,
      column: combinationData.inputEvalList[0],
    }))
    setCombinationTableData({ combinationData })
  }, [])

  useEffect(() => {
    if (!file || isEmptyData(settingValues)) {
      return
    }
    updateCombinationTable()
  }, [
    file,
    updateCombinationTable,
    settingValues,
  ])

  return (
    <FileDataContext.Provider
      value={{
        file,
        isEmptyData,
        handleDrop,
        settingValues,
        setSettingValues,
        purposeList,
        settingData,
        combinationTableData,
        combinationTableSortingInfo,
        setCombinationTableSortingInfo,
        selectedCombinationTableRow,
        setSelectedCombinationTableRow,
        combinationValue,
        setCombinationValue
      }}
    >
      {children}
    </FileDataContext.Provider>
  )
}

export const useFileData = () => useContext(FileDataContext)