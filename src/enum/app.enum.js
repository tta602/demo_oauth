'use strict';
//START GENERAL --------------------------------
const AppStatus = {
  active: 'active',
  inactive: 'inactive',
};

const TIMEZONE_DEFAULT = 'Asia/Ho_Chi_Minh';

const AppStatusList = Object.values(AppStatus);

//Start USER gender -----
const UserGenderEnum = {
  Male: "Male", 
  Female: "Female", 
  Other: "Other",
}
const UserGenderEnumList = Object.values(UserGenderEnum);

const UserGenderJsonList = [
  {
    code: UserGenderEnum.Male,
    vi: 'Nam',
    en: 'Male',
  },
  {
    code: UserGenderEnum.Female,
    vi: 'Nữ',
    en: 'Female',
  },
  {
    code: UserGenderEnum.Other,
    vi: 'Khác',
    en: 'Other',
  }
]


//evironment
const AppEnvironmentStatusEnum = {
  pro: "pro",
  dev: "dev",
  uat: "uat",
};

const AppEnvironmentStatusEnumList = Object.values(AppEnvironmentStatusEnum);

module.exports = {
  AppStatus,
  AppStatusList,
  UserGenderEnum,
  UserGenderEnumList,
  TIMEZONE_DEFAULT,
  AppEnvironmentStatusEnumList,
  UserGenderJsonList
};
