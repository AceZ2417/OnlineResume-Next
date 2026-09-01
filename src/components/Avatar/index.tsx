type AvatarShape = 'circle' | 'square';
type AvatarSize = 'default' | 'small' | 'large' | number | string;

export type AvatarProps = {
  avatarSrc?: string;
  className?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
};

/**
 * 头像组件：纯 DOM 实现，去掉对 antd Avatar 的依赖。
 * 支持 shape（circle/square）和 size（枚举或像素数字），
 * 无 src 时显示空占位（打印时隐藏）。
 */
export function Avatar({ avatarSrc, className, shape = 'circle', size = 'default' }: AvatarProps) {
  const sizeMap: Record<string, number> = { small: 48, default: 84, large: 120 };
  const px = typeof size === 'number' ? size : sizeMap[String(size)] ?? sizeMap.default;
  const borderRadius = shape === 'circle' ? '50%' : 4;

  const outerStyle: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius,
    overflow: 'hidden',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    background: '#fafafa',
  };

  const emptyStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: '#f3f4f6',
    border: '1px dashed #d1d5db',
    borderRadius,
  };

  const cls = `avatar ${!avatarSrc ? 'avatar-hidden' : ''} ${className ?? ''}`.trim();

  return (
    <div className={cls} style={outerStyle}>
      {avatarSrc ? (
        <img src={avatarSrc} alt="avatar" style={imgStyle} className="avatar-img" />
      ) : (
        <div className="avatar-empty" style={emptyStyle} />
      )}
    </div>
  );
}
