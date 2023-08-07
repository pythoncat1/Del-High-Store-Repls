import PromptIcon from "./icons/Prompt";
import { Avatar } from "./Avatar";
import { IconButton } from "./IconButton";
import { Pill } from "./Pill";
import { Text } from "./Text";
import { rcss } from "./themes";
import { RUIUserRoles } from "./UserRoleLabel";
import { View } from "./View";

type limitedRoles =
  | RUIUserRoles.Admin
  | RUIUserRoles.Moderator
  | RUIUserRoles.Teacher
  | RUIUserRoles.Student;

const limitedRoleLabels: { [key in limitedRoles]: string } = {
  [RUIUserRoles.Admin]: "Admin",
  [RUIUserRoles.Moderator]: "Community Moderator",
  [RUIUserRoles.Teacher]: "Teacher",
  [RUIUserRoles.Student]: "Student",
};

export interface UserProps {
  /** Image url. If null, initials are displayed */
  src: string | null;
  /** Username of the user */
  username: string;
  /** Full name of the user (first + last) */
  fullName?: string;
  /** Display name of the user */
  displayName?: string;
  /** Use smaller avatar */
  small?: boolean;
  /** Global role of user (e.g. moderator, admin, staff, etc) */
  role?: limitedRoles;
  /** Contextual role of user (e.g. are they the teacher in a team? or admin in a team? or template author?) */
  localRole?: string;
  /** are they on a paid plan? */
  plan?: "hacker-family" | "teamspro";
  /** Used to accept styling via css prop */
  className?: string;
}

/** Shows user's avatar, name and Replit prompt */
export function User({
  src,
  username,
  fullName,
  displayName,
  small,
  role,
  localRole,
  plan,
  ...props
}: UserProps) {
  return (
    <View
      css={[rcss.rowWithGap(8), rcss.align.center, { flexShrink: 1 }]}
      {...props}
    >
      <Avatar
        src={src}
        username={username}
        fullName={fullName}
        size={small ? 24 : 32}
        layout="intrinsic"
      />
      <View
        css={[
          rcss.rowWithGap(4),
          rcss.align.center,
          rcss.flex.growAndShrink(1),
        ]}
      >
        {displayName !== undefined ? (
          <View css={rcss.colWithGap(4)}>
            <Text>{displayName}</Text>
            <Text variant="small" css={rcss.color("foregroundDimmest")}>
              @{username}
            </Text>
          </View>
        ) : (
          <Text>{username}</Text>
        )}
        {plan !== undefined && (
          <IconButton alt="plan subscriber" colorway="primary">
            <PromptIcon />
          </IconButton>
        )}
        {role !== undefined && (
          <Pill colorway="primary" text={renderRoleText(role)} />
        )}
        {localRole !== undefined && <Pill text={localRole} />}
      </View>
    </View>
  );
}

function renderRoleText(role: limitedRoles): string {
  return limitedRoleLabels[role];
}
