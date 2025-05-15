import { Flex, FlexProps, theme, Typography } from 'antd';
import { CSSProperties } from 'react';
import './styles.css';

type LogoProps = {
  color: CSSProperties['color'];
  imgSize?: {
    h?: number | string;
    w?: number | string;
  };
  asLink?: boolean;
  href?: string;
  bgColor?: CSSProperties['backgroundColor'];
  collapsed?: boolean; // Add collapsed prop
} & Partial<FlexProps>;

export const Logo = ({
  asLink,
  color,
  imgSize,
  bgColor,
  collapsed,
  ...others
}: LogoProps) => {
  const {
    token: { borderRadius },
  } = theme.useToken();

  return asLink ? (
    <Flex gap={others.gap || 'small'} align="center" {...others}>
      <img
        src="/logo-no-background.png"
        alt="design sparx logo"
        height={imgSize?.h || 48}
        width={imgSize?.w || (collapsed ? imgSize?.h || 48 : undefined)} // Set width when collapsed
      />
      {!collapsed && ( // Only show text when not collapsed
        <Typography.Title
          level={5}
          type="secondary"
          style={{
            color,
            margin: 0,
            padding: `4px 8px`,
            backgroundColor: bgColor,
            borderRadius,
          }}
        >
          Drawer Admin
        </Typography.Title>
      )}
    </Flex>
  ) : (
    <Flex gap={others.gap || 'small'} align="center" {...others}>
      <img
        src="/logo-no-background.png"
        alt="design sparx logo"
        height={imgSize?.h || 48}
        width={imgSize?.w || (collapsed ? imgSize?.h || 48 : undefined)} // Set width when collapsed
      />
      {!collapsed && ( // Only show text when not collapsed
        <Typography.Title
          level={4}
          type="secondary"
          style={{
            color,
            margin: 0,
            padding: `4px 8px`,
            backgroundColor: bgColor,
            borderRadius,
          }}
        >
          Antd Admin
        </Typography.Title>
      )}
    </Flex>
  );
};
