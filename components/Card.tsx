import styles from "../styles/Card.module.css";
import Image from "next/image";
import { MdAccountCircle } from "react-icons/md";
import { Badge, OverlayTrigger, Popover } from "react-bootstrap";
import { Placement } from "react-bootstrap/types";
import { MdCancel } from "react-icons/md";

export interface CardProps {
  value?: number;
  canClose?: boolean;
  color?: string;
  selected?: boolean;
  name?: string | null;
  badgeConfig?: BadgeConfig;
  onRemoveUser?: () => void;
}

export interface BadgeConfig {
  badgeText?: string | null;
  popupText?: any;
  popupTitle?: string | null;
  position?: Placement;
}

const Card = ({
  value,
  canClose,
  color,
  selected = false,
  name = null,
  badgeConfig = {},
  onRemoveUser,
}: CardProps) => {
  const popover = (
    <Popover id="popover-basic">
      {badgeConfig?.popupTitle && (
        <Popover.Header as="h3">{badgeConfig?.popupTitle}</Popover.Header>
      )}
      <Popover.Body>{badgeConfig?.popupText}</Popover.Body>
    </Popover>
  );
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div
          className={
            !selected
              ? `container ${styles.customCard} col-1`
              : `container ${styles.customCard} ${styles.customCardSelected}`
          }
        >
          <div className="row h-25">
            <div className="d-none d-sm-block col-sm-6 px-2">
              <Image
                alt="card"
                src="/images/favicon.png"
                width={50}
                height={50}
              />
            </div>
            {canClose && (
              <div className="col-12 col-sm-6 text-end">
                <MdCancel color="red" size={"26"} onClick={onRemoveUser} />
              </div>
            )}
          </div>

          <div className="row text-center h-50">
            {value && (
              <span className={`fw-bold ${styles.valueCard}`}>{value}</span>
            )}
            {color && !value && <MdAccountCircle color={color} size={60} />}
          </div>
          <div className="row justify-content-end h-25">
            <div
              className={`d-none d-sm-block col-6 px-2 ${styles.logoBottom}`}
            >
              <Image
                alt="card"
                src="/images/favicon.png"
                width={50}
                height={50}
              />
            </div>
          </div>
        </div>
      </div>
      {name && (
        <div className="row justify-content-center">
          <span className="text-light w-100 text-center fw-bold px-0">
            {name}
          </span>
        </div>
      )}

      {badgeConfig && (
        <OverlayTrigger
          trigger="click"
          placement={badgeConfig?.position}
          overlay={popover}
        >
          <Badge
            bg={"danger"}
            pill={true}
            className={
              badgeConfig.position == "left"
                ? "position-absolute top-0 start-0 translate-middle"
                : "position-absolute top-0 start-100 translate-middle"
            }
          >
            {badgeConfig.badgeText}
          </Badge>
        </OverlayTrigger>
      )}
    </div>
  );
};

const style = {
  fontSize: "150px",
  color: "blue",
};

export default Card;
