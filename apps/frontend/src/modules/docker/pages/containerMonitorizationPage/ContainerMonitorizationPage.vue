<template>
    <v-container fluid>
        <crud-layout
            title="Monitorizacion de contenedores"
            subtitle="Monitorizá los contenedores desplegados"
        >
            <AddButton />
        </crud-layout>
    </v-container>
</template>

<script>

import { AddButton, CrudLayout } from "@dracul/common-frontend"

export default {
    name: "ContainerMonitorizationPage",
    components: {
        AddButton,
        CrudLayout,
    },
    data() {
        return {
            networks: [],
        }
    },
    computed: {
        headers() {
            return 'headers'
        },
    },
    async created() {
    },
    methods: {

    }
}
</script>