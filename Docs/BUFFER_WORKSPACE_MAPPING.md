# Buffer Workspace Mapping

`behaviorschool.com/admin` owns both Buffer workspaces. They must remain
separate because the same platform can represent a different brand page.

| Brand | API key variable | Channel variables |
| --- | --- | --- |
| RobSpain.com | `BUFFER_ROBSPAIN_API_KEY` | `BUFFER_ROBSPAIN_LINKEDIN_CHANNEL_ID`, `BUFFER_ROBSPAIN_FACEBOOK_CHANNEL_ID`, `BUFFER_ROBSPAIN_INSTAGRAM_CHANNEL_ID`, `BUFFER_ROBSPAIN_YOUTUBE_CHANNEL_ID` |
| BehaviorSchool.com | `BUFFER_BEHAVIORSCHOOL_API_KEY` | `BUFFER_BEHAVIORSCHOOL_FACEBOOK_CHANNEL_ID`, `BUFFER_BEHAVIORSCHOOL_INSTAGRAM_CHANNEL_ID`, `BUFFER_BEHAVIORSCHOOL_YOUTUBE_CHANNEL_ID` |

The Behavior School channel IDs verified in Buffer are:

- Facebook Page: `6a73be9f99afb443490c8753`
- `behavior.school` Instagram: `6a73bf3399afb443490c8916`
- Behavior School YouTube: `6a74bbc899afb443491344d2`

The admin status panel checks that these values are present and flags a
mismatch. It never displays API key values. The old unscoped `BUFFER_API_KEY`
is deliberately ignored.

The blog social route creates a Buffer draft only. It does not publish or
schedule directly. Default routing is RobSpain.com for LinkedIn and
BehaviorSchool.com for Facebook, Instagram, and YouTube. A caller can provide
an explicit brand per platform when a cross-brand post is intentional.

The Behavior Study Tools social publisher uses the same named Behavior School
API key and channel registry. It requires
`BUFFER_BEHAVIORSCHOOL_ORGANIZATION_ID` and does not read the deprecated
`BUFFER_API_KEY`, `BUFFER_ORGANIZATION_ID`, or
`BUFFER_BEHAVIOR_SCHOOL_CHANNELS_JSON` variables.
