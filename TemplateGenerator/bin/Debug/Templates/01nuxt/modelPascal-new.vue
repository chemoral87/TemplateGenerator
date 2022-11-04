#set($myValues = ["created_at", "updated_at"])
<template>
  <v-container fluid>     
    <v-form ref="form" @submit.prevent="save${modelPascal}">
        <v-row dense>
#foreach ( $element in $DataModel.Rows)
#if( $element.column_key != "PRI" && !$myValues.contains($element.column_name)) 
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="${element.column_name}"
            v-model="${model}.${element.column_name}"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
#end
#end
		</v-row>
		   <v-bottom-navigation app fixed :value="1" color="primary" grow>
        <v-spacer />
        <v-btn @click.native="$emit('cancel')" color="error" text class="mr-1">
          <span>Cancelar</span>
          <v-icon>mdi-cancel</v-icon>
        </v-btn>

        <v-btn type="submit" text class="mr-4">
          <span>Guardar</span>
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-form> 
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
	  ${model}: {}
	};
  },
  methods: {
    async save${modelPascal}(){
	  await this.$repository.${modelPascal}.create(this.${model})
        .then((res) => { 
           this.$router.push($modelKebab'');
        })
        .catch((e) => {
          alert(e);
        });
	},
    cancel() {
      this.$router.push('/${modelKebab}');
    },
  },
  mounted() {
    let me = this;
  },
  validate({ store, error }) {
    if (store.getters.permissions.includes("${modelKebab}-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Nuevo ${modelPascal}", icon: "home" });
  },
};
</script>
