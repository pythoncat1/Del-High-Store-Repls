import { Label } from "./Label";

// This is a subset of roles used within RUI originating from UserRoles ('generated-gql/graphql-types') to remove external RUI dependencies.
// Update when new roles are used within RUI.
export enum RUIUserRoles {
  Admin = "ADMIN",
  Detective = "DETECTIVE",
  Featured = "FEATURED",
  LanguageJammer = "LANGUAGE_JAMMER",
  Moderator = "MODERATOR",
  ReplitRep = "REPLIT_REP",
  ReplitRepEdu = "REPLIT_REP_EDU",
  Patron = "PATRON",
  Pythonista = "PYTHONISTA",
  Student = "STUDENT",
  Teacher = "TEACHER",
  Hacker = "hacker",
  HackerPro = "hacker_pro",
}

interface Props {
  /** You can't pass children to a <UserRoleLabel>, but forwardRef tries to permit it unless forbidden.
   *
   * @private
   */
  children?: never;
  /** User role */
  userRole: RUIUserRoles | string;
  /** If role not recognized the defaulted label text */
  name: string;
  /** Tagline for role (used as aria title attribute) */
  tagline?: string;
}

/**
 * Use a UserRoleLabel when displaying a users role label. Like in areas where we display their profile information.
 */
export const UserRoleLabel = ({ userRole: role, tagline, name }: Props) => {
  switch (role as RUIUserRoles) {
    case "DETECTIVE":
      return <Label.Detective tagline={tagline} />;
    case "MODERATOR":
      return <Label.Moderator tagline={tagline} />;
    case "LANGUAGE_JAMMER":
      return <Label.LanguageJammer tagline={tagline} />;
    case "FEATURED":
      return <Label.Featured tagline={tagline} />;
    case "ADMIN":
      return <Label.Admin tagline={tagline} />;
    case "REPLIT_REP":
      return <Label.ReplitRep tagline={tagline} />;
    case "REPLIT_REP_EDU":
      return <Label.ReplitRepEdu tagline={tagline} />;
    case "PATRON":
      return <Label.Patron tagline={tagline} />;
    case "PYTHONISTA":
      return <Label.Pythonista tagline={tagline} />;
    case "hacker":
      return <Label.Hacker tagline={tagline} />;
    case "hacker_pro":
      return <Label.Pro tagline={tagline} />;
    default:
      return <Label.Default tagline={tagline} name={name} />;
  }
};

export default UserRoleLabel;
