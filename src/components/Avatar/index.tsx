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

  const style: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius: shape === 'circle' ? '50%' : 4,
  };

  const cls = `avatar ${!avatarSrc ? 'avatar-hidden' : ''} ${className ?? ''}`.trim();

  return (
    <div className={cls}>
      {avatarSrc ? (
        <img src={avatarSrc} alt="avatar" style={style} className="avatar-img" />
      ) : (
        <div className="avatar-empty" style={style} />
      )}
    </div>
  );
}
