import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import FtLoader from '../../components/ft-loader/ft-loader.vue'
import FtProfileEdit from '../../components/ft-profile-edit/ft-profile-edit.vue'
import FtProfileChannelList from '../../components/ft-profile-channel-list/ft-profile-channel-list.vue'
import FtProfileFilterChannelsList from '../../components/ft-profile-filter-channels-list/ft-profile-filter-channels-list.vue'
import { MAIN_PROFILE_ID } from '../../../constants'

export default Vue.extend({
  name: 'ProfileEdit',
  components: {
    'ft-loader': FtLoader,
    'ft-profile-edit': FtProfileEdit,
    'ft-profile-channel-list': FtProfileChannelList,
    'ft-profile-filter-channels-list': FtProfileFilterChannelsList
  },
  data: function () {
    return {
      isLoading: true,
      isNew: false,
      profileId: '',
      profile: {}
    }
  },
  computed: {
    ...mapGetters([
      'profileById'
    ]),

    profileList: function () {
      return this.$store.getters.getProfileList
    },

    isMainProfile: function () {
      return this.profileId === MAIN_PROFILE_ID
    }
  },
  watch: {
    profileList: {
      handler: function () {
        const profile = this.profileById(this.profileId)
        if (!profile) {
          this.showToast({
            message: this.$t('Profile.Profile could not be found')
          })
          this.$router.push({
            path: '/settings/profile/'
          })
        }
        this.profile = profile
      },
      deep: true
    }
  },
  mounted: async function () {
    const profileType = this.$route.name

    this.deletePromptLabel = `${this.$t('Profile.Are you sure you want to delete this profile?')} ${this.$t('Profile["All subscriptions will also be deleted."]')}`

    if (profileType === 'newProfile') {
      this.isNew = true
      const bgColor = await this.getRandomColor()
      const textColor = await this.calculateColorLuminance(bgColor)
      this.profile = {
        name: '',
        bgColor: bgColor,
        textColor: textColor,
        subscriptions: []
      }
    } else {
      this.isNew = false
      this.profileId = this.$route.params.id

      const profile = this.profileById(this.profileId)
      if (!profile) {
        this.showToast({
          message: this.$t('Profile.Profile could not be found')
        })
        this.$router.push({
          path: '/settings/profile/'
        })
      }
      this.profile = profile
    }

    this.isLoading = false
  },
  methods: {
    ...mapActions([
      'showToast',
      'getRandomColor',
      'calculateColorLuminance'
    ])
  }
})
