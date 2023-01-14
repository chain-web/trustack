import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

export default function ChangeI18n() {
  const { t, i18n } = useTranslation();
  return (
    <Select
      style={{
        float: "right",
        minWidth: "80px",
        marginRight: '8px',
        marginTop: '8px'
      }}
      defaultValue={"en"}
      onChange={(e) => {
        i18n.changeLanguage(e)
      }}
    >
      <Select.Option value={"en"}>English</Select.Option>
      <Select.Option value={"zh"}>简体中文</Select.Option>
    </Select>
  );
}
