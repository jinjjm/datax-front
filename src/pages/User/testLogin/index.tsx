import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import {
    AlipayOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoOutlined,
    UserOutlined,
    WeiboOutlined,
    WechatOutlined
  } from '@ant-design/icons';
  import {
    LoginFormPage,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
  } from '@ant-design/pro-components';
  import { Button, Divider, message, Space, Tabs, Card, Image } from 'antd';
  import type { CSSProperties } from 'react';
  import { useState } from 'react';
  import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
  import { flushSync } from 'react-dom';
  import { useEmotionCss } from '@ant-design/use-emotion-css';
  import './index.css';
  import title from './title.png';
import { request } from 'express';
  type LoginType = 'phone' | 'account';
  
  const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };
  
  export default () => {
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
    const [type, setType] = useState<string>('account');
    const { initialState, setInitialState } = useModel('@@initialState');
    const intl = useIntl();
    const containerClassName = useEmotionCss(() => {
      return {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        backgroundImage:
          "url('http://boot3.jeecg.com/assets/jeecg_bg.e3ae838c.png')",
        backgroundSize: '100% 100%',
      };
    });
    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        console.log("userInfo: ", userInfo)
        if (userInfo) {
          flushSync(() => {
            setInitialState((s) => ({
              ...s,
              currentUser: userInfo,
            }));
          });
        }
      };
    
      const handleSubmit = async (values: API.LoginParams) => {
        try {
          // 登录
          const msg = await login({ ...values, type });
          console.log("handleSubmit msg", msg);
    
          if (msg.status === 'ok') {
            const defaultLoginSuccessMessage = intl.formatMessage({
              id: 'pages.login.success',
              defaultMessage: '登录成功！',
            });
            message.success(defaultLoginSuccessMessage);
            await fetchUserInfo();
            console.log("await fetchUserInfo();")
            const urlParams = new URL(window.location.href).searchParams;
            history.push(urlParams.get('redirect') || '/');
            return;
          }
          console.log("登陆失败", msg);
          // 如果失败去设置用户错误信息
          setUserLoginState(msg);
        } catch (error) {
          const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: '登录失败，请重试！',
          });
          console.log(error);
          message.error(defaultLoginFailureMessage);
        }
      };
    const [loginType, setLoginType] = useState<LoginType>('account');
    return (
      <div className={containerClassName}>
        <div style={{ width:'70vw', height:'80vh', marginTop:'10vh', marginLeft:'15vw',position: 'relative'}}>
          <div
            style={{
              backgroundColor: 'white',
              height: '100%',
              width: '100%',
              position:'absolute', 
              zIndex: 1
            }}
          >
            <LoginFormPage
              // backgroundImageUrl="http://boot3.jeecg.com/assets/jeecg_ad.93fbfa48.png"
              // backgroundImageUrl="./back.png"
              logo={<img alt="logo" src="/logo.svg" />}
              title="天津市公路数据共享与交换平台"
      
              actions={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Divider plain>
                    <span
                      style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}
                    >
                      其他登录方式
                    </span>
                  </Divider>
                  <Space align="center" size={24}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: 40,
                        width: 40,
                        border: '1px solid #D4D8DD',
                        borderRadius: '50%',
                      }}
                    >
                      <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: 40,
                        width: 40,
                        border: '1px solid #D4D8DD',
                        borderRadius: '50%',
                      }}
                    >
                      <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: 40,
                        width: 40,
                        border: '1px solid #D4D8DD',
                        borderRadius: '50%',
                      }}
                    >
                      <WeiboOutlined style={{ ...iconStyles, color: '#333333' }} />
                    </div>
                  </Space>
                </div>
              }
              onFinish={async (values) => {
                await handleSubmit(values as API.LoginParams);
              }}
            >
              <Tabs
                centered
                activeKey={loginType}
                onChange={(activeKey) => setLoginType(activeKey as LoginType)}
              >
                <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
                <Tabs.TabPane key={'phone'} tab={'手机号登录'} />
              </Tabs>
              {loginType === 'account' && (
                <>
                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'用户名: admin or user'}
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名!',
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'密码: ant.design'}
                    rules={[
                      {
                        required: true,
                        message: '请输入密码！',
                      },
                    ]}
                  />
                </>
              )}
              {loginType === 'phone' && (
                <>
                  <ProFormText
                    fieldProps={{
                      size: 'large',
                      prefix: <MobileOutlined className={'prefixIcon'} />,
                    }}
                    name="mobile"
                    placeholder={'手机号'}
                    rules={[
                      {
                        required: true,
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！',
                      },
                    ]}
                  />
                  <ProFormCaptcha
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    captchaProps={{
                      size: 'large',
                    }}
                    placeholder={'请输入验证码'}
                    captchaTextRender={(timing, count) => {
                      if (timing) {
                        return `${count} ${'获取验证码'}`;
                      }
                      return '获取验证码';
                    }}
                    name="captcha"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ]}
                    onGetCaptcha={async () => {
                      message.success('获取验证码成功！验证码为：1234');
                    }}
                  />
                </>
              )}
              <div
                style={{
                  marginBlockEnd: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  自动登录
                </ProFormCheckbox>
                <a
                  style={{
                    float: 'right',
                  }}
                >
                  忘记密码
                </a>
              </div>
            </LoginFormPage>
            
          </div>
          {/* <div style={{position:'absolute', zIndex: 10, marginTop: '22%', marginLeft:'4%'}}>
            <Image preview={false} src={require('./title.png')} style={{width:500}}></Image>
          </div> */}
        </div>
        <Footer />
      </div>
    );
  };